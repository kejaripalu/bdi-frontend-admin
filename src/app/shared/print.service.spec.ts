import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { Page } from './page';
import { PrintService } from './print.service';

function page<T>(content: T[], number: number, totalPages: number): Page<T> {
  return { content, number, totalPages, totalElements: content.length * totalPages, size: content.length };
}

describe('PrintService', () => {
  let service: PrintService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PrintService);
  });

  it('fetchAll reads every page (0-based) and concatenates the rows', done => {
    const calls: number[] = [];
    service.fetchAll<number>((p, size) => {
      calls.push(p);
      expect(size).toBe(100);
      return of(page([p * 10, p * 10 + 1], p, 3));
    }).subscribe(rows => {
      expect(calls).toEqual([0, 1, 2]);
      expect(rows).toEqual([0, 1, 10, 11, 20, 21]);
      done();
    });
  });

  it('fetchAll stops after maxPages', done => {
    const calls: number[] = [];
    service.fetchAll<number>((p) => { calls.push(p); return of(page([p], p, 50)); }, 100, 3)
      .subscribe(rows => {
        expect(calls).toEqual([0, 1, 2]);
        expect(rows.length).toBe(3);
        done();
      });
  });

  it('fetchAll returns an empty list for an empty first page', done => {
    service.fetchAll<number>(() => of(page<number>([], 0, 0))).subscribe(rows => {
      expect(rows).toEqual([]);
      done();
    });
  });

  it('buildView renders numbered rows with headers, subtitle and total', () => {
    const view = service.buildView(document, {
      title: 'Register Surat Masuk',
      subtitle: 'Oktober 2026',
      printedBy: 'ucup',
      columns: [{ header: 'Asal', value: (r: { asal: string }) => r.asal }],
      rows: [{ asal: 'A' }, { asal: 'B' }]
    });
    expect(view.querySelector('h1')?.textContent).toBe('Register Surat Masuk');
    expect(view.textContent).toContain('Oktober 2026');
    expect(view.textContent).toContain('oleh ucup');
    expect(Array.from(view.querySelectorAll('th')).map(th => th.textContent)).toEqual(['No', 'Asal']);
    const cells = Array.from(view.querySelectorAll('tbody td')).map(td => td.textContent);
    expect(cells).toEqual(['1', 'A', '2', 'B']);
    expect(view.querySelector('.total')?.textContent).toBe('Total: 2 data');
  });

  it('buildView never interprets record data as HTML', () => {
    const payload = '<img src=x onerror="window.__pwned=1"><script>window.__pwned=1</script>';
    const view = service.buildView(document, {
      title: 't', subtitle: 's',
      columns: [{ header: 'H', value: (r: { v: string }) => r.v }],
      rows: [{ v: payload }]
    });
    expect(view.querySelector('img')).toBeNull();
    expect(view.querySelector('script')).toBeNull();
    expect(view.querySelector('tbody td:last-child')?.textContent).toBe(payload);
  });

  it('formats dates as dd-MM-yyyy without Date, and joins non-empty lines', () => {
    expect(service.date('2026-02-07')).toBe('07-02-2026');
    expect(service.date(null)).toBe('');
    expect(service.date('bukan tanggal')).toBe('bukan tanggal');
    expect(service.lines('a', null, '', undefined, 'b', 0)).toBe('a\nb\n0');
  });

  it('formats numbers in the Indonesian locale', () => {
    expect(service.number(1500000.5, 2, 2)).toBe('1.500.000,50');
    expect(service.number(12)).toBe('12');
    expect(service.number(null)).toBe('');
  });

  it('maps sektor and prodin codes to their descriptions (and falls back to the code)', () => {
    expect(service.sektor('PAKEM')).not.toBe('PAKEM');
    expect(service.sektor('TIDAK_ADA')).toBe('TIDAK_ADA');
    expect(service.subbid('PAKEM')).toMatch(/^Subseksi [AB]$/);
    expect(service.prodin('LAPINHAR')).not.toBe('LAPINHAR');
  });

  it('builds a download file name from the title and subtitle', () => {
    const options = { title: 'Register Surat Masuk', subtitle: 'Jenis Surat: BIASA | Oktober 2026', columns: [], rows: [] };
    expect(service.fileName(options)).toBe('Register-Surat-Masuk_Jenis-Surat-BIASA-Oktober-2026.xlsx');
    expect(service.fileName({ ...options, subtitle: 'Pencarian "a/b" - Tahun 2026' })).toBe('Register-Surat-Masuk_Pencarian-a-b-Tahun-2026.xlsx');
  });

  it('exportExcel downloads an .xlsx blob through a temporary link', () => {
    const clicks: { download: string; href: string }[] = [];
    spyOn(HTMLAnchorElement.prototype, 'click').and.callFake(function (this: HTMLAnchorElement) {
      clicks.push({ download: this.download, href: this.href });
    });
    service.exportExcel({
      title: 'Register Arsip', subtitle: 'Oktober 2026', printedBy: 'ucup',
      columns: [{ header: 'Perihal', value: (r: { p: string }) => r.p }],
      rows: [{ p: 'satu' }, { p: 'dua' }]
    });
    expect(clicks.length).toBe(1);
    expect(clicks[0].download).toBe('Register-Arsip_Oktober-2026.xlsx');
    expect(clicks[0].href.startsWith('blob:')).toBeTrue();
    expect(document.querySelector('a[download]')).toBeNull();
  });
});
