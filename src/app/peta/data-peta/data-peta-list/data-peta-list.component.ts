import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from 'src/app/shared/message';
import { DataPeta } from '../data-peta.model';
import { Month } from 'src/app/shared/month';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataPetaService } from '../data-peta.service';
import { ToastService } from 'src/app/shared/toast.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ConfirmDeleteService } from 'src/app/shared/delete-modal/confirm-delete.service';
import { BidangDirektoratSektorPetaService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor-peta.service';

@Component({
  selector: 'app-data-peta-list',
  templateUrl: './data-peta-list.component.html',
  styleUrls: ['./data-peta-list.component.css']
})
export class DataPetaListComponent implements OnInit, OnDestroy {

  private name: string = "Data Peta";
  private message: Message = new Message();
  dataPeta: DataPeta[] = [];
  title?: string;
  sektorList: any[] = [];
  sektorMap: { [key: string]: string } = {};
  month = Object.keys(Month).filter((v) => isNaN(Number(v)));
  currentYear = new Date().getFullYear(); // get current year
  year: number[] = [];
  indexBidang!: number;
  namaBidang: string = null as any;
  isLoading: boolean = false;
  error: string = null as any;
  private dataPetaSub!: Subscription;
  private dataPetaQueryParamSub!: Subscription;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  isSearching: boolean = false;
  currentNotificationStatus: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sektorPeta: BidangDirektoratSektorPetaService,
    private dataPetaService: DataPetaService,
    public toastService: ToastService,
    private notificationStatusService: NotificationService,
    private confirmDeleteService: ConfirmDeleteService
  ) { }

  ngOnInit(): void {
    this.error = false as any;
    this.isLoading = true;
    this.getYear();
    // prepare sektor lookup map so template can show deskripsiSektor
    this.sektorList = this.sektorPeta.getSektor();
    this.sektorList.forEach(s => {
      if (s && s.namaSektor) {
        this.sektorMap[s.namaSektor] = s.deskripsiSektor;
      }
    });
    this.dataPetaQueryParamSub = this.route.queryParams
      .subscribe((queryParams) => {
        this.indexBidang = this.sektorPeta.getBidangDirektori()
          .findIndex(obj => {
            return obj.namaBidang === queryParams['bidang'];
          });
        // if index not found set to index 0 (IPOLHANKAM)
        if (this.indexBidang < 0) {
          this.indexBidang = 0;
        }
        this.title = this.sektorPeta.getBidangDirektori()[this.indexBidang].deskripsiBidang;
        this.namaBidang = this.sektorPeta.getBidangDirektori()[this.indexBidang].namaBidang!;
        this.fetchDataPeta();
      });
  }
 

  fetchDataPeta() {
    this.dataPetaSub = this.dataPetaService.getAll(
      this.pageNumber - 1,
      this.pageSize,
      this.namaBidang,
      this.currentYear.toString())
      .subscribe({
        next: (response) => {
          // console.log(response);
          this.dataPeta = response.content;
          this.pageNumber = response.number + 1;
          this.pageSize = response.size;
          this.totalElements = response.totalElements;
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
      this.dataPetaQueryParamSub = this.route.queryParams
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

  onCreate() {
    this.router.navigate(['/data-peta', 'list', 'form'], {
      queryParams: { bidang: this.namaBidang }
    });
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.isLoading = true;
    this.fetchDataPeta();
  }

  onDelete(ids: string) {
    if (ids != null || ids != '') {
      this.isLoading = true;
      this.dataPetaSub = this.dataPetaService.delete(ids)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.fetchDataPeta();
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
    this.fetchDataPeta();
  }

  onSearching(value: string) {
    if (value.trim() === '') {
      return;
    }
    this.isLoading = true;
    this.pageNumber = 1;
    this.dataPetaSub = this.dataPetaService.getBySearch(
      value,
      this.pageNumber - 1,
      this.pageSize,
      this.namaBidang,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.dataPeta = responseData.content;
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
        () => { this.onDelete(ids); }, //If Confirm button is pressed
        () => { } //If Dismissed button is pressed
      );
  }

  ngOnDestroy(): void {
    if (this.dataPetaQueryParamSub) {
      this.dataPetaQueryParamSub.unsubscribe();
    }
    if (this.dataPetaSub) {
      this.dataPetaSub.unsubscribe();
    }
    this.toastService.clear();
  }

}
