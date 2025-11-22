import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterOpsin } from '../opsin.model';
import { Month } from 'src/app/shared/month';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { RegisterOpsinService } from '../opsin.service';
import { ToastService } from 'src/app/shared/toast.service';
import { Message } from 'src/app/shared/message';
import { NotificationService } from 'src/app/shared/notification.service';
import { ConfirmDeleteService } from 'src/app/shared/delete-modal/confirm-delete.service';

@Component({
    selector: 'app-opsin-list',
    templateUrl: './opsin-list.component.html',
    styleUrls: ['./opsin-list.component.css'],
    standalone: false
})
export class OpsinListComponent implements OnInit, OnDestroy {
  private name: string = "Register Operasi Intelijen";
  private message: Message = new Message();
  opsin: RegisterOpsin[] = [];
  month = Object.keys(Month).filter((v) => isNaN(Number(v)));
  currentMonth = new Date().getMonth() + 1; // get current month
  currentYear = new Date().getFullYear(); // get current year
  year: number[] = [];
  indexBidang!: number;
  namaBidang: string = null as any;
  isLoading: boolean = false;
  error: string = null as any;
  private opsinSub!: Subscription;
  private opsinQueryParamSub!: Subscription;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  isSearching: boolean = false;
  currentNotificationStatus: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bidangDirektoratSektorService: BidangDirektoratSektorService,
    private opsinService: RegisterOpsinService,
    public toastService: ToastService,
    private notificationStatusService: NotificationService,
    private confirmDeleteService: ConfirmDeleteService) { }

  ngOnInit(): void {
    this.error = false as any;
    this.isLoading = true;
    this.getYear();
    this.opsinQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        this.indexBidang = this.bidangDirektoratSektorService.getBidangDirektori()
          .findIndex(obj => {
            return obj.namaBidang === queryParams['bidang'];
          });
        // if index not found set to index 0 (IPOLHANKAM)
        if (this.indexBidang < 0) {
          this.indexBidang = 0;
        }
        this.namaBidang = this.bidangDirektoratSektorService.getBidangDirektori()[this.indexBidang].namaBidang!;
        this.loadDataOpsin();
      });
    this.checkMessage();
  }

  loadDataOpsin() {
    this.opsinSub = this.opsinService.getAll(
      this.pageNumber - 1,
      this.pageSize,
      this.namaBidang,
      +this.currentMonth,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.opsin = responseData.content;
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
    this.opsinQueryParamSub = this.route.queryParams
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

  onNewOpsin() {
    this.router.navigate(['/opsin', 'list', 'form'], {
      queryParams: { bidang: this.namaBidang }
    });
  }

  onDelete(ids: string) {
    if (ids != null || ids != '') {
      this.isLoading = true;
      this.opsinSub = this.opsinService.delete(ids)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.loadDataOpsin();
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
    this.loadDataOpsin();
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
    this.loadDataOpsin();
  }

  searchingOpsin(value: string) {
    if (value.trim() === '') {
      return;
    }
    this.isLoading = true;
    this.pageNumber = 1;
    this.opsinSub = this.opsinService.getSearch(
      value,
      this.pageNumber - 1,
      this.pageSize,
      this.namaBidang,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.opsin = responseData.content;
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

  updateMonthSelected(month: number) {
    this.currentMonth = +month;
    this.pageNumber = 1;
    this.isLoading = true;
    this.loadDataOpsin();
  }

  openModalDelete(ids: string) {
    this.confirmDeleteService.openModal()
      .result.then(
        () => { this.onDelete(ids); }, //If Confirm button is pressed
        () => { } //If Dismissed button is pressed
      );
  }

  ngOnDestroy(): void {
    if (this.opsinQueryParamSub) {
      this.opsinQueryParamSub.unsubscribe();
    }
    if (this.opsinSub) {
      this.opsinSub.unsubscribe();
    }
    this.toastService.clear();
  }

}
