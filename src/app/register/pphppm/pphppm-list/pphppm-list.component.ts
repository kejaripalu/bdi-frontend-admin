import { PrintOptions, PrintService } from 'src/app/shared/print.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterPPHPPM } from '../pphppm.model';
import { Month } from 'src/app/shared/month';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RegisterPPHPPMService } from '../pphppm.service';
import { ToastService } from 'src/app/shared/toast.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { Message } from 'src/app/shared/message';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmDeleteService } from 'src/app/shared/delete-modal/confirm-delete.service';

@Component({
    selector: 'app-pphppm-list',
    templateUrl: './pphppm-list.component.html',
    styleUrls: ['./pphppm-list.component.css'],
    standalone: false
})
export class PphppmListComponent implements OnInit, OnDestroy {
  private name: string = "Register PPH & PPM";
  private message: Message = new Message();
  pphppm: RegisterPPHPPM[] = [];
  month = Object.keys(Month).filter((v) => isNaN(Number(v)));
  currentMonth = new Date().getMonth() + 1; // get current month
  currentYear = new Date().getFullYear(); // get current year
  year: number[] = [];
  isLoading: boolean = false;
  error: string = null as any;
  private pphppmSub!: Subscription;
  private pphppmQueryParamSub!: Subscription;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  isSearching: boolean = false;
  currentNotificationStatus: boolean = false;

  private userSub: Subscription = null as any;
  isAuthenticated: boolean = false;
  token = null as any;

  outputMode: 'print' | 'excel' | null = null;
  private printSub!: Subscription;
  private searchedValue: string | null = null;

  constructor(
    private printService: PrintService,
    private router: Router,
    private route: ActivatedRoute,
    private pphppmService: RegisterPPHPPMService,
    private toastService: ToastService,
    private notificationStatusService: NotificationService,
    private authService: AuthService,
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
    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });

    this.pphppmSub = this.pphppmService.getAll(
      this.pageNumber - 1,
      this.pageSize,
      +this.currentMonth,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.pphppm = responseData.content;
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
    this.pphppmQueryParamSub = this.route.queryParams
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

  onNewPPHPPM() {
    this.router.navigate(['/pphppm', 'list', 'form']);
  }

  onDelete(ids: string) {
    if (ids != null || ids != '') {
      this.isLoading = true;
      this.pphppmSub = this.pphppmService.delete(ids)
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
    this.loadData();
  }

  searchingPPHPPM(value: string) {
    if (value.trim() === '') {
      return;
    }
    this.searchedValue = value;
    this.isLoading = true;
    this.pageNumber = 1;
    this.pphppmSub = this.pphppmService.getSearch(
      value,
      this.pageNumber - 1,
      this.pageSize,
      this.currentYear.toString())
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.pphppm = responseData.content;
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
    this.printSub = p.fetchAll<RegisterPPHPPM>((page, size) => searchedValue === null
      ? this.pphppmService.getAll(page, size, +this.currentMonth, this.currentYear.toString())
      : this.pphppmService.getSearch(searchedValue, page, size, this.currentYear.toString()))
      .subscribe({
        next: (rows) => {
          this.outputMode = null;
          if (rows.length === 0) {
            this.toastService.show('Tidak ada data untuk dicetak.', { classname: 'bg-warning', delay: 5000 });
            return;
          }
          const options: PrintOptions<RegisterPPHPPM> = {
            title: 'Register PPH & PPM',
            subtitle,
            rows,
            columns: [
          { header: 'Nama Petugas', value: row => row.namaPetugasPenerima },
          { header: 'Waktu', value: row => p.lines(p.date(row.tanggal), row.jam) },
          { header: 'Jenis Pelayanan', value: row => row.jenisPelayanan === 'PPM' ? 'Pengaduan Masyarakat' : 'Pelayanan Hukum' },
          { header: 'Identitas Pelapor', value: row => [row.namaTamu, row.tempatLahirTamu, p.date(row.tanggalLahirTamu), row.alamat, row.jenisKelamin === 'TIDAK_DITENTUKAN' ? 'jenis kelamin tidak disebutkan' : row.jenisKelamin?.toLowerCase(), row.nomorHandphone, row.email, row.pekerjaan, row.nomorIdentitas].filter(part => !!part).join(', ') },
          { header: 'Nama Organisasi', value: row => row.namaOrganisasi },
          { header: 'Informasi yang disampaikan', value: row => row.informasiYangDisampaikan }
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
    if (this.pphppmQueryParamSub) {
      this.pphppmQueryParamSub.unsubscribe();
    }
    if (this.pphppmSub) {
      this.pphppmSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    this.toastService.clear();
  }

}
