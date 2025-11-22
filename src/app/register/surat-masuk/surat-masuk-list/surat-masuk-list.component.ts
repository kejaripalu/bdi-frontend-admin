import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Month } from 'src/app/shared/month';
import { ToastService } from 'src/app/shared/toast.service';
import { SuratMasuk } from '../surat-masuk.model';
import { SuratMasukService } from '../surat-masuk.service';
import { Message } from 'src/app/shared/message';
import { NotificationService } from 'src/app/shared/notification.service';
import { ConfirmDeleteService } from 'src/app/shared/delete-modal/confirm-delete.service';

@Component({
    selector: 'app-surat-masuk-list',
    templateUrl: './surat-masuk-list.component.html',
    styleUrls: ['./surat-masuk-list.component.css'],
    standalone: false
})
export class SuratMasukListComponent implements OnInit, OnDestroy {
  private name: string = "Register Surat Masuk";
  private message: Message = new Message();
  suratMasuk: SuratMasuk[] = [];
  month = Object.keys(Month).filter((v) => isNaN(Number(v)));
  currentMonth = new Date().getMonth() + 1; // get current month
  currentYear = new Date().getFullYear(); // get current year
  year: number[] = [];
  isLoading: boolean = false;
  error: string = null as any;
  jenisSurat: string = null as any;
  private suratMasukSub!: Subscription;
  private suratMasukQueryParamSub!: Subscription;
  pageNumber: number = 1;
  pageSize: number = 10;
  indexValue: number = 0;
  totalElements: number = 0;
  isSearching: boolean = false;
  currentNotificationStatus: boolean = false;

  constructor(private suratMasukService: SuratMasukService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private notificationStatusService: NotificationService,
    private confirmDeleteService: ConfirmDeleteService) { }

  ngOnInit(): void {
    this.error = false as any;
    this.isLoading = true;
    this.getYear();
    this.suratMasukQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        this.jenisSurat = queryParams['jenisSurat']?.toUpperCase() !== 'RAHASIA' ? 'BIASA' : 'RAHASIA';
      });
    this.loadDataSuratMasuk();
    this.checkMessage();
  }

  checkMessage() {
    this.suratMasukQueryParamSub = this.route.queryParams
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

  loadDataSuratMasuk() {
    this.suratMasukSub = this.suratMasukService.getSuratMasuk(
      this.pageNumber - 1,
      this.pageSize,
      this.jenisSurat,
      +this.currentMonth,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.suratMasuk = responseData.content;
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

  onNewSuratMasuk() {
    let jenisSrt = null as any;
    switch (this.jenisSurat) {
      case 'BIASA':
        jenisSrt = 'biasa';
        break;
      case 'RAHASIA':
        jenisSrt = 'rahasia';
        break;
      default:
        jenisSrt = 'biasa';
    }
    this.router.navigate(['/surat-masuk', jenisSrt, 'form'], {
      queryParams: { jenisSurat: this.jenisSurat }
    });
  }

  onDeleteSuratMasuk(ids: string) {
    if (ids != null || ids != '') {
      this.isLoading = true;
      this.suratMasukSub = this.suratMasukService.deleteSuratMasuk(ids)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.loadDataSuratMasuk();
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

  getYear() {
    for (let startYear = 2019; startYear <= this.currentYear; startYear++) {
      this.year.push(startYear);
    }
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadDataSuratMasuk();
  }

  updateMonthSelected(month: number) {
    this.currentMonth = +month;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadDataSuratMasuk();
  }

  updateYearSelected(year: number) {
    this.currentYear = +year;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadDataSuratMasuk();
  }

  onSearchingMode() {
    this.isSearching = true;
  }

  onDateTimeShowData() {
    this.isSearching = false;
  }

  searchingSuratMasuk(value: string) {
    if (value.trim() === '') {
      return;
    }
    this.isLoading = true;
    this.pageNumber = 1;
    this.suratMasukSub = this.suratMasukService.getSearchSuratMasuk(
      value,
      this.pageNumber - 1,
      this.pageSize,
      this.jenisSurat,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.suratMasuk = responseData.content;
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
        () => { this.onDeleteSuratMasuk(ids); }, //If Confirm button is pressed
        () => { } //If Dismissed button is pressed
      );
  }

  ngOnDestroy(): void {
    if (this.suratMasukSub) {
      this.suratMasukSub.unsubscribe();
    }
    if (this.suratMasukQueryParamSub) {
      this.suratMasukQueryParamSub.unsubscribe();
    }
    this.toastService.clear();
  }

}
