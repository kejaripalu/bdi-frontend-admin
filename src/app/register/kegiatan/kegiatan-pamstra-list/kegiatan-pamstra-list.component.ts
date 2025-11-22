import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { Month } from 'src/app/shared/month';
import { ToastService } from 'src/app/shared/toast.service';
import { RegisterKegiatanIntelijenPamstra } from '../kegiatan-pamstra.model';
import { RegisterKegiatanIntelijenPamstraService } from '../kegiatan-pamstra.service';
import { Message } from 'src/app/shared/message';
import { NotificationService } from 'src/app/shared/notification.service';
import { ConfirmDeleteService } from 'src/app/shared/delete-modal/confirm-delete.service';

@Component({
    selector: 'app-kegiatan-pamstra-list',
    templateUrl: './kegiatan-pamstra-list.component.html',
    styleUrls: ['./kegiatan-pamstra-list.component.css'],
    standalone: false
})
export class KegiatanPamstraListComponent implements OnInit, OnDestroy {
  private name: string = "Register Kegiatan Intelijen";
  private message: Message = new Message();
  giat: RegisterKegiatanIntelijenPamstra[] = [];
  month = Object.keys(Month).filter((v) => isNaN(Number(v)));
  currentMonth = new Date().getMonth() + 1; // get current month
  currentYear = new Date().getFullYear(); // get current year
  year: number[] = [];
  isLoading: boolean = false;
  error: string = null as any;
  indexBidang!: number;
  namaBidang: string = null as any;
  private giatSub!: Subscription;
  private giatQueryParamSub!: Subscription;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  isSearching: boolean = false;
  currentNotificationStatus: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bidangDirektoratSektorService: BidangDirektoratSektorService,
    private giatService: RegisterKegiatanIntelijenPamstraService,
    public toastService: ToastService,
    private notificationStatusService: NotificationService,
    private confirmDeleteService: ConfirmDeleteService) { }

  ngOnInit(): void {
    this.error = false as any;
    this.isLoading = true;
    this.getYear();
    this.giatQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        this.indexBidang = this.bidangDirektoratSektorService.getBidangDirektori()
          .findIndex(obj => {
            return obj.namaBidang === queryParams['bidang'];
          });
        // if index not found set to index 3 (PAMSTRA)
        if (this.indexBidang < 0) {
          this.indexBidang = 3;
        }
        this.namaBidang = this.bidangDirektoratSektorService.getBidangDirektori()[this.indexBidang].namaBidang!;
        this.loadDataGiat();
      });
    this.checkMessage();
  }

  loadDataGiat() {
    this.giatSub = this.giatService.getAll(
      this.pageNumber - 1,
      this.pageSize,
      +this.currentMonth,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.giat = responseData.content;
          this.pageNumber = responseData.number + 1;
          this.pageSize = responseData.size;
          this.totalElements = responseData.totalElements;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Aduh... Gagal ambil data dari server!!!';
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

  checkMessage() {
    this.giatQueryParamSub = this.route.queryParams
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

  onNewGiat() {
    this.router.navigate(['/kegiatan', 'list', 'pamstra-form'], {
      queryParams: { bidang: this.namaBidang }
    });
  }

  onDelete(ids: string) {
    if (ids != null || ids != '') {
      this.isLoading = true;
      this.giatSub = this.giatService.delete(ids)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.loadDataGiat();
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
    this.loadDataGiat();
  }

  onDateTimeShowData() {
    this.isSearching = false;
  }

  onSearchingMode() {
    this.isSearching = true;
  }

  updateYearSelected(year: number) {
    this.currentYear = +year;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadDataGiat();
  }

  searchingGiat(value: string) {
    if (value.trim() === '') {
      return;
    }
    this.isLoading = true;
    this.pageNumber = 1;
    this.giatSub = this.giatService.getSearch(
      value,
      this.pageNumber - 1,
      this.pageSize,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.giat = responseData.content;
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
    this.loadDataGiat();
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

  ngOnDestroy(): void {
    if (this.giatQueryParamSub) {
      this.giatQueryParamSub.unsubscribe();
    }
    if (this.giatSub) {
      this.giatSub.unsubscribe();
    }
    this.toastService.clear();
  }

}
