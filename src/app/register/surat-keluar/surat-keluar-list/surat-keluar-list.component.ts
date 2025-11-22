import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Month } from 'src/app/shared/month';
import { ToastService } from 'src/app/shared/toast.service';
import { SuratKeluar } from '../surat-keluar.model';
import { SuratKeluarService } from '../surat-keluar.service';
import { Message } from 'src/app/shared/message';
import { NotificationService } from 'src/app/shared/notification.service';
import { ConfirmDeleteService } from 'src/app/shared/delete-modal/confirm-delete.service';

@Component({
    selector: 'app-surat-keluar-list',
    templateUrl: './surat-keluar-list.component.html',
    styleUrls: ['./surat-keluar-list.component.css'],
    standalone: false
})
export class SuratKeluarListComponent implements OnInit, OnDestroy {
  
  // Variable
  private name: string = "Register Surat Keluar";
  private message: Message = new Message();
  suratKeluar: SuratKeluar[] = [];
  jenisSurat: string = null as any;
  
  // Month and Year
  month = Object.keys(Month).filter((v) => isNaN(Number(v)));
  currentMonth = new Date().getMonth() + 1; // get current month
  currentYear = new Date().getFullYear(); // get current year
  year: number[] = [];
  
  // Loading
  isLoading: boolean = false;
  error: string = null as any;
  
  // Subscription
  private suratKeluarSub!: Subscription;
  private suratKeluarQueryParamSub!: Subscription;
  
  // Pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  isSearching: boolean = false;
  
  // Notification
  currentNotificationStatus: boolean = false;
  
  // Sorting
  orderDate: boolean = false;
  orderKepada: boolean = false;
  orderPerihal: boolean = false;
  isDesc: boolean = true;
  
  constructor(
    private suratKeluarService: SuratKeluarService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: ToastService,
    private notificationStatusService: NotificationService,
    private confirmDeleteService: ConfirmDeleteService) { }

  ngOnInit(): void {
    this.error = false as any;
    this.isLoading = true;
    this.getYear();
    this.suratKeluarQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        this.jenisSurat = queryParams['jenisSurat']?.toUpperCase() !== 'R' ? 'BIASA' : 'RAHASIA';
      });
    this.loadDataSuratKeluar();
    this.checkMessage();
  }

  checkMessage() {
    this.suratKeluarQueryParamSub = this.route.queryParams
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

  loadDataSuratKeluar() {
    this.suratKeluarSub = this.suratKeluarService.getSuratKeluar(
      this.pageNumber - 1,
      this.pageSize,
      this.jenisSurat,
      +this.currentMonth,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          this.suratKeluar = responseData.content;
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

  getYear() {
    for (let startYear = 2019; startYear <= this.currentYear; startYear++) {
      this.year.push(startYear);
    }
  }

  onNewSuratKeluar() {
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
    this.router.navigate(['/surat-keluar', jenisSrt, 'form'], {
      queryParams: { jenisSurat: this.jenisSurat === 'RAHASIA' ? 'R' : 'B' }
    });
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadDataSuratKeluar();
  }

  updateMonthSelected(month: string) {
    this.currentMonth = +month;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadDataSuratKeluar();
  }

  updateYearSelected(year: string) {
    this.currentYear = +year;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadDataSuratKeluar();
  }

  searchingSuratKeluar(value: string) {
    if (value.trim() === '') {
      return;
    }
    this.isLoading = true;
    this.pageNumber = 1;
    this.suratKeluarSub = this.suratKeluarService.getSearchSuratKeluar(
      value,
      this.pageNumber - 1,
      this.pageSize,
      this.jenisSurat,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.suratKeluar = responseData.content;
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

  onSearchingMode() {
    this.isSearching = true;
  }

  onDateTimeShowData() {
    this.isSearching = false;
  }

  onDeleteSuratKeluar(ids: string) {
    if (ids != null || ids != '') {
      this.isLoading = true;
      this.suratKeluarSub = this.suratKeluarService.deleteSuratKeluar(ids)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.loadDataSuratKeluar();
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

  openModalDelete(ids: string) {
    this.confirmDeleteService.openModal()
      .result.then(
        () => { this.onDeleteSuratKeluar(ids); }, //If Confirm button is pressed
        () => { } //If Dismissed button is pressed
      );
  }

  onNotificationStatusChange(status: boolean) {
    this.notificationStatusService.changeNotificationStatus(status);
  }

  sortTanggal() {
    if (!this.orderDate) {
      const asc = this.suratKeluar.sort((a, b) =>
        new Date(a.tanggalSurat).getDate() - new Date(b.tanggalSurat).getDate());
      this.suratKeluar = asc;
      this.isDesc = false;
    } else {
      const desc = this.suratKeluar.sort((a, b) =>
        new Date(b.tanggalSurat).getDate() - new Date(a.tanggalSurat).getDate());
      this.suratKeluar = desc;
      this.isDesc = true;
    }

    this.orderDate = !this.orderDate;
  }

  sortKepada(property: string) {
    this.sortString(property);
    this.orderKepada = !this.orderKepada;
  }

  sortPerihal(property: string) {
    this.sortString(property);
    this.orderPerihal = !this.orderPerihal;
  }

  sortString(property: string) {
    this.isDesc = !this.isDesc;
    const direction = this.isDesc ? 1 : -1;
    this.suratKeluar.sort((a, b) => {
      if (a[property as keyof typeof a] < b[property as keyof typeof b]) {
        return -1 * direction;
      } else if (a[property as keyof typeof a] > b[property as keyof typeof b]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.suratKeluarSub) {
      this.suratKeluarSub.unsubscribe();
    }
    if (this.suratKeluarQueryParamSub) {
      this.suratKeluarQueryParamSub.unsubscribe();
    }
    this.toastService.clear();
  }

}
