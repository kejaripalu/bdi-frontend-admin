import { PrintOptions, PrintService } from 'src/app/shared/print.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Month } from 'src/app/shared/month';
import { ToastService } from 'src/app/shared/toast.service';
import { Arsip } from '../arsip.model';
import { ArsipService } from '../arsip.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { Message } from 'src/app/shared/message';
import { ConfirmDeleteService } from 'src/app/shared/delete-modal/confirm-delete.service';

@Component({
    selector: 'app-arsip-list',
    templateUrl: './arsip-list.component.html',
    styleUrls: ['./arsip-list.component.css'],
    standalone: false
})
export class ArsipListComponent implements OnInit, OnDestroy {
  private name: string = "Register Arsip";
  private message: Message = new Message();
  arsip: Arsip[] = [];
  month = Object.keys(Month).filter((v) => isNaN(Number(v)));
  currentMonth = new Date().getMonth() + 1; // get current month
  currentYear = new Date().getFullYear(); // get current year
  year: number[] = [];
  isLoading: boolean = false;
  error: string = null as any;
  jenisSurat: string = null as any;
  private arsipSub!: Subscription;
  private arsipQueryParamSub!: Subscription;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  isSearching: boolean = false;
  currentNotificationStatus: boolean = false;

  outputMode: 'print' | 'excel' | null = null;
  private printSub!: Subscription;
  private searchedValue: string | null = null;

  constructor(
    private printService: PrintService,
    private arsipService: ArsipService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private notificationStatusService: NotificationService,
   private confirmDeleteService: ConfirmDeleteService) { }

  ngOnInit(): void {
    this.error = false as any;
    this.isLoading = true;
    this.getYear();
    this.loadData();
    this.checkMessage();
  }

  loadData() {
    this.searchedValue = null;
    this.arsipSub = this.arsipService.getAll(
      this.pageNumber - 1,
      this.pageSize,
      +this.currentMonth,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.arsip = responseData.content;
          this.pageNumber = responseData.number + 1;
          this.pageSize = responseData.size;
          this.totalElements = responseData.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.error = this.message.errorGetData;
          this.isLoading = false;
        }
      });
    this.notificationStatusService.currentNotificationStatus.subscribe(notification => this.currentNotificationStatus = notification);
  }

  checkMessage() {
    this.arsipQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        if (queryParams['message'] === 'SimpanSukses' && this.currentNotificationStatus) {
          this.toastService.show(this.message.saveMessage + this.name + '!!!',
            { classname: 'bg-success text-light', delay: 5000 });
          this.onNotificationStatusChange(false);
        } else if (queryParams['message'] === 'UpdateSukses' && this.currentNotificationStatus) {
          this.toastService.show(this.message.updateMessage + this.name + '!!!',
            { classname: 'bg-success text-light', delay: 5000 });
          this.onNotificationStatusChange(false);
        } else {
          return;
        }
      });
  }

  getYear() {
    for (let startYear = 2019; startYear <= this.currentYear; startYear++) {
      this.year.push(startYear);
    }
  }

  onNewArsip() {
    this.router.navigate(['/arsip', 'list', 'form']);
  }

  onDeleteArsip(ids: string) {
    if (ids != null || ids != '') {
      this.isLoading = true;
      this.arsipSub = this.arsipService.delete(ids)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.loadData();
            this.toastService.show(this.message.deleteMessage + this.name + '!!!',
              { classname: 'bg-success text-light', delay: 5000 });
          },
          error: (errorMessage) => {
            this.error = errorMessage;
            this.isLoading = false;
          }
        });
    }
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadData();
  }

  updateMonthSelected(month: number) {
    this.currentMonth = +month;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadData();
  }

  updateYearSelected(year: number) {
    this.currentYear = +year;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadData();
  }

  onSearchingMode() {
    this.isSearching = true;
  }

  onDateTimeShowData() {
    this.isSearching = false;
  }

  searchingArsip(value: string) {
    if (value.trim() === '') {
      return;
    }
    this.searchedValue = value;
    this.isLoading = true;
    this.pageNumber = 1;
    this.arsipSub = this.arsipService.getSearch(
      value,
      this.pageNumber - 1,
      this.pageSize,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.arsip = responseData.content;
          this.pageNumber = responseData.number + 1;
          this.pageSize = responseData.size;
          this.totalElements = responseData.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.error = this.message.errorGetData;
          this.isLoading = false;
        }
      });
  }

  onNotificationStatusChange(status: boolean) {
    this.notificationStatusService.changeNotificationStatus(status);
  }

  openModalDelete(ids: string) {
    this.confirmDeleteService.openModal()
      .result.then(
        () => { this.onDeleteArsip(ids); }, //If Confirm button is pressed
        () => { } //If Dismissed button is pressed
      );
  }

  onPrint() {
    this.runOutput('print');
  }

  onExportExcel() {
    this.runOutput('excel');
  }

  /** Loads every page for the current view, then prints it (PDF) or downloads it as Excel. */
  private runOutput(mode: 'print' | 'excel') {
    if (this.outputMode) {
      return;
    }
    this.outputMode = mode;
    const searchedValue = this.searchedValue;
    const subtitle = [searchedValue === null ? `${this.month[this.currentMonth - 1]} ${this.currentYear}` : `Pencarian "${searchedValue}" - Tahun ${this.currentYear}`].join(' | ');
    const p = this.printService;
    this.printSub = p.fetchAll<Arsip>((page, size) => searchedValue === null
      ? this.arsipService.getAll(page, size, +this.currentMonth, this.currentYear.toString())
      : this.arsipService.getSearch(searchedValue, page, size, this.currentYear.toString()))
      .subscribe({
        next: (rows) => {
          this.outputMode = null;
          if (rows.length === 0) {
            this.toastService.show('Tidak ada data untuk dicetak.', { classname: 'bg-warning', delay: 5000 });
            return;
          }
          const options: PrintOptions<Arsip> = {
            title: 'Register Arsip',
            subtitle,
            rows,
            columns: [
          { header: 'Waktu Penerimaan Arsip', value: row => p.lines(p.date(row.tanggalPenerimaanArsip), row.jamPenerimaanArsip) },
          { header: 'Diterima Dari', value: row => row.diterimaDari },
          { header: 'Nomor & Tgl Surat', value: row => p.lines(row.nomorSurat, p.date(row.tanggalSurat)) },
          { header: 'Perihal', value: row => row.perihal },
          { header: 'Kode Penyimpanan', value: row => row.kodePenyimpanan }
            ]
          };
          if (mode === 'print') {
            p.print(options);
          } else {
            p.exportExcel(options);
          }
        },
        error: () => {
          this.outputMode = null;
          this.toastService.show(this.message.errorGetData, { classname: 'bg-danger text-light', delay: 5000 });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.printSub) {
      this.printSub.unsubscribe();
    }
    if (this.arsipSub) {
      this.arsipSub.unsubscribe();
    }
    if (this.arsipQueryParamSub) {
      this.arsipQueryParamSub.unsubscribe();
    }
    this.toastService.clear();
  }

}
