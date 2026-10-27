import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EMPTY, Observable, expand, reduce } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { BidangDirektoratSektorPetaService } from './bidang-direktorat/bidang-direktorat-sektor-peta.service';
import { BidangDirektoratSektorService } from './bidang-direktorat/bidang-direktorat-sektor.service';
import { Page } from './page';
import { ProdinService } from './prodin/prodin.service';
import { buildXlsx, sheetNameOf } from './xlsx-writer';

export interface PrintColumn<T> {
  header: string;
  value: (row: T) => string;
}

export interface PrintOptions<T> {
  title: string;
  /** Period, filter and search description shown under the title. */
  subtitle: string;
  columns: PrintColumn<T>[];
  rows: T[];
  printedBy?: string;
}

const PRINT_CSS = `
  @page { size: A4 landscape; margin: 12mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #000; }
  h1 { margin: 0 0 4px; font-size: 15pt; }
  .meta { margin: 0 0 2px; font-size: 9pt; color: #333; }
  table { width: 100%; margin-top: 10px; border-collapse: collapse; }
  thead { display: table-header-group; }
  th, td { padding: 4px 6px; border: 1px solid #777; text-align: left; vertical-align: top; }
  th { background: #e9e9e9; font-size: 9pt; }
  td { white-space: pre-line; word-break: break-word; }
  tr { page-break-inside: avoid; }
  .no { width: 28px; text-align: right; }
  .total { margin-top: 8px; font-size: 9pt; }
`;

/**
 * Prints register data as PDF through the browser print dialog ("Save as PDF").
 * Rows come from the existing paged list/search endpoints; the document is built with
 * textContent only, so record data is never interpreted as HTML.
 */
@Injectable({ providedIn: 'root' })
export class PrintService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private sektorService: BidangDirektoratSektorService,
    private sektorPetaService: BidangDirektoratSektorPetaService,
    private prodinService: ProdinService) { }

  /** Loads every page of a list/search endpoint (page numbers are 0-based). */
  fetchAll<T>(fetchPage: (page: number, size: number) => Observable<Page<T>>,
              size: number = 100, maxPages: number = 100): Observable<T[]> {
    return fetchPage(0, size).pipe(
      expand(page => page.number + 1 < page.totalPages && page.number + 1 < maxPages
        ? fetchPage(page.number + 1, size)
        : EMPTY),
      reduce((all: T[], page) => all.concat(page.content), [] as T[])
    );
  }

  print<T>(options: PrintOptions<T>): void {
    const view = this.document.createElement('iframe');
    view.setAttribute('aria-hidden', 'true');
    view.setAttribute('tabindex', '-1');
    view.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    this.document.body.appendChild(view);

    const win = view.contentWindow!;
    const doc = view.contentDocument!;
    doc.open();
    doc.write('<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"></head><body></body></html>');
    doc.close();
    doc.title = options.title;
    const style = doc.createElement('style');
    style.textContent = PRINT_CSS;
    doc.head.appendChild(style);
    doc.body.appendChild(this.buildView(doc, {
      ...options,
      printedBy: options.printedBy ?? this.authService.user.value?.username
    }));

    const cleanup = () => view.remove();
    win.onafterprint = cleanup;
    setTimeout(cleanup, 5 * 60 * 1000);
    setTimeout(() => {
      win.focus();
      win.print();
    }, 150);
  }

  /** Downloads the same rows and columns as an .xlsx file (no library; see xlsx-writer). */
  exportExcel<T>(options: PrintOptions<T>): void {
    const bytes = buildXlsx({
      name: options.title,
      titleRows: [options.title, options.subtitle, this.printedLine(options.printedBy ?? this.authService.user.value?.username)]
        .filter(line => !!line),
      header: ['No', ...options.columns.map(column => column.header)],
      rows: options.rows.map((row, index) => [index + 1, ...options.columns.map(column => column.value(row) ?? '')]),
      footer: `Total: ${options.rows.length} data`
    });
    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement('a');
    link.href = url;
    link.download = this.fileName(options);
    link.style.display = 'none';
    this.document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  /** "Register Surat Masuk" + "Jenis Surat: BIASA | Oktober 2026" -> "Register-Surat-Masuk_Jenis-Surat-BIASA-Oktober-2026.xlsx" */
  fileName<T>(options: PrintOptions<T>): string {
    const slug = (text: string) => text.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const name = [slug(sheetNameOf(options.title)), slug(options.subtitle)].filter(part => !!part).join('_');
    return name.slice(0, 100) + '.xlsx';
  }

  /** Builds the printable document body. Exposed for tests. */
  buildView<T>(doc: Document, options: PrintOptions<T>): HTMLElement {
    const root = doc.createElement('main');

    const title = doc.createElement('h1');
    title.textContent = options.title;
    root.appendChild(title);

    const lines = [options.subtitle, this.printedLine(options.printedBy)];
    for (const text of lines) {
      if (text) {
        const meta = doc.createElement('p');
        meta.className = 'meta';
        meta.textContent = text;
        root.appendChild(meta);
      }
    }

    const table = doc.createElement('table');
    const head = doc.createElement('tr');
    for (const header of ['No', ...options.columns.map(c => c.header)]) {
      const th = doc.createElement('th');
      th.textContent = header;
      if (header === 'No') {
        th.className = 'no';
      }
      head.appendChild(th);
    }
    const thead = doc.createElement('thead');
    thead.appendChild(head);
    table.appendChild(thead);

    const tbody = doc.createElement('tbody');
    options.rows.forEach((row, index) => {
      const tr = doc.createElement('tr');
      const no = doc.createElement('td');
      no.className = 'no';
      no.textContent = String(index + 1);
      tr.appendChild(no);
      for (const column of options.columns) {
        const td = doc.createElement('td');
        td.textContent = column.value(row) ?? '';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    root.appendChild(table);

    const total = doc.createElement('p');
    total.className = 'total';
    total.textContent = `Total: ${options.rows.length} data`;
    root.appendChild(total);
    return root;
  }

  // ---- value helpers used by the list components -------------------------------------------

  /** "yyyy-MM-dd" -> "dd-MM-yyyy" without going through Date (no timezone shift). */
  date(value: string | null | undefined): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '');
    return match ? `${match[3]}-${match[2]}-${match[1]}` : (value ?? '');
  }

  /** Joins the non-empty parts with a line break. */
  lines(...parts: (string | number | null | undefined)[]): string {
    return parts.filter(part => part !== null && part !== undefined && part !== '').join('\n');
  }

  number(value: number | null | undefined, minFraction: number = 0, maxFraction: number = 0): string {
    return value === null || value === undefined
      ? ''
      : new Intl.NumberFormat('id-ID', { minimumFractionDigits: minFraction, maximumFractionDigits: maxFraction }).format(value);
  }

  /** Sector description, same text as the sektorPipe in the tables. */
  sektor(value: string): string {
    return this.sektorService.getSektor().find(s => s.namaSektor === value)?.deskripsiSektor ?? value;
  }

  /** "Subseksi A/B" by the sector's directorate, same rule as sektorPipe 'subbid'. */
  subbid(value: string): string {
    const bidang = this.sektorService.getSektor().find(s => s.namaSektor === value)?.bidangDirektorat;
    if (bidang === 'IPOLHANKAM' || bidang === 'SOSBUDMAS' || bidang === 'TIPRODIN') {
      return 'Subseksi A';
    }
    if (bidang === 'EKOKEU' || bidang === 'PAMSTRA') {
      return 'Subseksi B';
    }
    return '';
  }

  sektorPeta(value: string): string {
    return this.sektorPetaService.getSektor().find(s => s.namaSektor === value)?.deskripsiSektor ?? value;
  }

  prodin(value: string): string {
    return this.prodinService.getProdin().find(p => p.jenisProdin === value)?.deskripsiProdin ?? value;
  }

  private printedLine(printedBy?: string): string {
    const now = new Date();
    const tanggal = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const jam = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return `Dicetak: ${tanggal} ${jam}` + (printedBy ? ` oleh ${printedBy}` : '');
  }
}
