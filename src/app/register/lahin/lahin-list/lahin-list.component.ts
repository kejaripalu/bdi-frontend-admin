import { PrintOptions, PrintService } from 'src/app/shared/print.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterLahin } from '../lahin.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RegisterTelaahanIntelijenService } from '../lahin.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Month } from 'src/app/shared/month';
import { Message } from 'src/app/shared/message';
import { NotificationService } from 'src/app/shared/notification.service';
import { ConfirmDeleteService } from 'src/app/shared/delete-modal/confirm-delete.service';

@Component({
    selector: 'app-lahin-list',
    templateUrl: './lahin-list.component.html',
    styleUrls: ['./lahin-list.component.css'],
    standalone: false
})
export class LahinListComponent implements OnInit, OnDestroy {
  private name: string = "Register Telaahan Intelijen";
  private message: Message = new Message();
  lahin: RegisterLahin[] = [];
  month = Object.keys(Month).filter((v) => isNaN(Number(v)));
  currentMonth = new Date().getMonth() + 1; // get current month
  currentYear = new Date().getFullYear(); // get current year
  year: number[] = [];
  isLoading: boolean = false;
  error: string = null as any;
  private lahinSub!: Subscription;
  private lahinQueryParamSub!: Subscription;
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
    private router: Router,
    private route: ActivatedRoute,
    private lahinService: RegisterTelaahanIntelijenService,
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
    this.lahinSub = this.lahinService.getAll(
      this.pageNumber - 1,
      this.pageSize,
      +this.currentMonth,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.lahin = responseData.content;
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
    this.lahinQueryParamSub = this.route.queryParams
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

  onNewLahin() {
    this.router.navigate(['/lahin', 'list', 'form']);
  }

  onDelete(ids: string) {
    if (ids != null || ids != '') {
      this.isLoading = true;
      this.lahinSub = this.lahinService.delete(ids)
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

  onSearchingMode() {
    this.isSearching = true;
  }

  onDateTimeShowData() {
    this.isSearching = false;
  }

  updateYearSelected(year: number) {
    this.currentYear = +year;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadData();
  }

  searchingLahin(value: string) {
    if (value.trim() === '') {
      return;
    }
    this.searchedValue = value;
    this.isLoading = true;
    this.pageNumber = 1;
    this.lahinSub = this.lahinService.getSearch(
      value,
      this.pageNumber - 1,
      this.pageSize,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.lahin = responseData.content;
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

  updateMonthSelected(month: number) {
    this.currentMonth = +month;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadData();
  }

  onNotificationStatusChange(status: boolean) {
    this.notificationStatusService.changeNotificationStatus(status);
  }

  openModalDelete(ids: string) {
    this.confirmDeleteService.openModal()
      .result.then(
        () => { this.onDelete(ids); }, //If Confirm button is pressed
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
    this.printSub = p.fetchAll<RegisterLahin>((page, size) => searchedValue === null
      ? this.lahinService.getAll(page, size, +this.currentMonth, this.currentYear.toString())
      : this.lahinService.getSearch(searchedValue, page, size, this.currentYear.toString()))
      .subscribe({
        next: (rows) => {
          this.outputMode = null;
          if (rows.length === 0) {
            this.toastService.show('Tidak ada data untuk dicetak.', { classname: 'bg-warning', delay: 5000 });
            return;
          }
          const options: PrintOptions<RegisterLahin> = {
            title: 'Register Telaahan Intelijen',
            subtitle,
            rows,
            columns: [
          { header: 'Nomor dan Tanggal', value: row => p.lines(row.nomor, p.date(row.tanggal)) },
          { header: 'Pembuat', value: row => row.pembuat },
          { header: 'Perihal', value: row => row.perihal },
          { header: 'Tindak Lanjut', value: row => row.tindakLanjut }
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
    if (this.lahinQueryParamSub) {
      this.lahinQueryParamSub.unsubscribe();
    }
    if (this.lahinSub) {
      this.lahinSub.unsubscribe();
    }
    this.toastService.clear();
  }

}
