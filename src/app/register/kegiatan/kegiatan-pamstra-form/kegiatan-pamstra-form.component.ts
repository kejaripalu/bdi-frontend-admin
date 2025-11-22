import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Sektor } from 'src/app/shared/bidang-direktorat/sektor';
import { RegisterKegiatanIntelijenPamstraService } from '../kegiatan-pamstra.service';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { RegisterKegiatanIntelijenPamstra } from '../kegiatan-pamstra.model';
import { NotificationService } from 'src/app/shared/notification.service';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
    selector: 'app-kegiatan-pamstra-form',
    templateUrl: './kegiatan-pamstra-form.component.html',
    styleUrls: ['./kegiatan-pamstra-form.component.css'],
    standalone: false
})
export class KegiatanPamstraFormComponent implements OnInit, OnDestroy {
  giatForm!: UntypedFormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private giatFormSub!: Subscription;
  private giatSub!: Subscription;
  private giatParamSub!: Subscription;
  private giatQueryParamSub!: Subscription;
  private id: string = null as any;
  namaBidang: string = null as any;
  indexBidang: number = 3;
  message: string = null as any;
  sektorList: Sektor[] = [];
  namaSektorSelected: string = null as any;
  tindakLanjutValue: boolean = true;
  pelaksanaanList: string[] = ['ON_PROGRESS', 'SELESAI', 'DIHENTIKAN'];
  pelaksanaanSelected: string = this.pelaksanaanList[0];
  currencyPaguAnggaran: number = 0;
  currencyNilaiKontrak: number = 0;
  currentNotificationStatus: boolean = false;

  modelDateTanggalSuratPermohonan: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalSprintWalpam: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalPemaparan: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalKertasKerja: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(
    private giatService: RegisterKegiatanIntelijenPamstraService,
    private bidangDirektoratSektorService: BidangDirektoratSektorService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.modelDateTanggalSuratPermohonan = this.calendar.getToday();
    this.modelDateTanggalSprintWalpam = this.calendar.getToday();
    this.modelDateTanggalPemaparan = this.calendar.getToday();
    this.modelDateTanggalKertasKerja = this.calendar.getToday();
    this.giatParamSub = this.route.params
      .subscribe((params: Params) => {
        this.isEditMode = params['id'] != null;
        this.id = params['id'];
      });
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
      });
    this.initForm();
    this.giatFormSub = this.giatForm.statusChanges.subscribe(
      // (status) => console.log(status)
    );
    this.notificationStatusService.currentNotificationStatus.subscribe(notification => this.currentNotificationStatus = notification);
  }

  private initForm() {
    let paguAnggaran = this.currencyPaguAnggaran;
    
    this.giatForm = new UntypedFormGroup({
      'namaKegiatan': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'sumberDana': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'instansi': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'paguAnggaran': new UntypedFormControl(paguAnggaran, [Validators.required]),
      'nomorSuratPermohonan': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'tanggalSuratPermohonan': new UntypedFormControl(this.modelDateTanggalSuratPermohonan, [Validators.required, Validators.minLength(10)]),
      'tempatPemaparan': new UntypedFormControl(null as any, [Validators.maxLength(255)]),
      'tanggalPemaparan': new UntypedFormControl(this.modelDateTanggalPemaparan, [Validators.minLength(10)]),
      'telaahanIntelijen': new UntypedFormControl(null as any),
      'tindakLanjut': new UntypedFormControl(null as any),
      'tindakLanjutKeterangan': new UntypedFormControl(null as any),
      'nomorSprintWalpam': new UntypedFormControl(null as any, [Validators.maxLength(255)]),
      'tanggalSprintWalpam': new UntypedFormControl(this.modelDateTanggalSprintWalpam, [Validators.minLength(10)]),
      'namaPetugasPelaksana': new UntypedFormControl(null as any, [Validators.maxLength(255)]),
      'nilaiKontrak': new UntypedFormControl(null as any),
      'hasilPelaksanaan': new UntypedFormControl(null as any),
      'hasilPelaksanaanKeterangan': new UntypedFormControl(null as any),
      'nomorKertasKerja': new UntypedFormControl(null as any, [Validators.maxLength(255)]),
      'tanggalKertasKerja': new UntypedFormControl(this.modelDateTanggalKertasKerja, [Validators.minLength(10)]),
      'keterangan': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'urlFile': new UntypedFormControl(null as any)
    });

    for (let i = 41; i < 61; i++) {
      this.sektorList.push(
        {
          deskripsiSektor: this.bidangDirektoratSektorService.getSektor()[i].deskripsiSektor!,
          namaSektor: this.bidangDirektoratSektorService.getSektor()[i].namaSektor!
        });
    }
    this.namaSektorSelected = this.sektorList[0].namaSektor!;

    if (this.isEditMode) {
      this.isLoadingEditForm = true;
      this.giatSub = this.giatService.getOne(this.id).subscribe({
        next: (giat) => {
          this.modelDateTanggalSuratPermohonan = {
            year: +giat.tanggalSuratPermohonan.slice(0, 4),
            month: +giat.tanggalSuratPermohonan.slice(5, 7),
            day: +giat.tanggalSuratPermohonan.slice(8, 10)
          };
          this.modelDateTanggalSprintWalpam = {
            year: +giat.tanggalSprintWalpam.slice(0, 4),
            month: +giat.tanggalSprintWalpam.slice(5, 7),
            day: +giat.tanggalSprintWalpam.slice(8, 10)
          };
          this.modelDateTanggalKertasKerja = {
            year: +giat.tanggalKertasKerja.slice(0, 4),
            month: +giat.tanggalKertasKerja.slice(5, 7),
            day: +giat.tanggalKertasKerja.slice(8, 10)
          };
          this.modelDateTanggalPemaparan = {
            year: +giat.tanggalPemaparan.slice(0, 4),
            month: +giat.tanggalPemaparan.slice(5, 7),
            day: +giat.tanggalPemaparan.slice(8, 10)
          };
          this.currencyPaguAnggaran = giat.paguAnggaran;
          this.currencyNilaiKontrak = giat.nilaiKontrak;

          this.giatForm = new UntypedFormGroup({
            'namaKegiatan': new UntypedFormControl(giat.namaKegiatan, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'sumberDana': new UntypedFormControl(giat.sumberDana, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'instansi': new UntypedFormControl(giat.instansi, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'paguAnggaran': new UntypedFormControl(this.currencyPaguAnggaran, [Validators.required]),
            'nomorSuratPermohonan': new UntypedFormControl(giat.nomorSuratPermohonan, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'tanggalSuratPermohonan': new UntypedFormControl(this.modelDateTanggalSuratPermohonan, [Validators.required, Validators.minLength(10)]),
            'tempatPemaparan': new UntypedFormControl(giat.tempatPemaparan, [Validators.maxLength(255)]),
            'tanggalPemaparan': new UntypedFormControl(this.modelDateTanggalPemaparan, [Validators.minLength(10)]),
            'telaahanIntelijen': new UntypedFormControl(giat.telaahanIntelijen),
            'tindakLanjut': new UntypedFormControl(giat.tindakLanjut),
            'tindakLanjutKeterangan': new UntypedFormControl(giat.tindakLanjutKeterangan),
            'nomorSprintWalpam': new UntypedFormControl(giat.nomorSprintWalpam, [Validators.maxLength(255)]),
            'tanggalSprintWalpam': new UntypedFormControl(this.modelDateTanggalSprintWalpam, [Validators.minLength(10)]),
            'namaPetugasPelaksana': new UntypedFormControl(giat.namaPetugasPelaksana, [Validators.minLength(3)]),
            'nilaiKontrak': new UntypedFormControl(this.currencyNilaiKontrak),
            'hasilPelaksanaan': new UntypedFormControl(giat.hasilPelaksanaan),
            'hasilPelaksanaanKeterangan': new UntypedFormControl(giat.hasilPelaksanaanKeterangan),
            'nomorKertasKerja': new UntypedFormControl(giat.nomorKertasKerja, [Validators.maxLength(255)]),
            'tanggalKertasKerja': new UntypedFormControl(this.modelDateTanggalKertasKerja, [Validators.minLength(10)]),
            'keterangan': new UntypedFormControl(giat.keterangan, Validators.maxLength(255)),
            'urlFile': new UntypedFormControl(giat.urlFile)
          });

          this.namaSektorSelected = giat.sektor;
          this.isLoadingEditForm = false;
          this.editModeError = false;
        },
        error: (errorMessage) => {
          this.isLoadingEditForm = false;
          this.error = errorMessage;
          this.editModeError = true;
        }
      });
    }
  }

  onSubmit() {
    this.isLoading = true;
    this.error = null as any;
    const dateTanggalSuratPermohonan = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalSuratPermohonan.year,
      this.modelDateTanggalSuratPermohonan.month,
      this.modelDateTanggalSuratPermohonan.day);
    const dateTanggalSprintWalpam = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalSprintWalpam.year,
      this.modelDateTanggalSprintWalpam.month,
      this.modelDateTanggalSprintWalpam.day);
    const dateTanggalKertasKerja = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalKertasKerja.year,
      this.modelDateTanggalKertasKerja.month,
      this.modelDateTanggalKertasKerja.day);
    const dateTanggalPemaparan = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalPemaparan.year,
      this.modelDateTanggalPemaparan.month,
      this.modelDateTanggalPemaparan.day);

    const giat = new RegisterKegiatanIntelijenPamstra();

    giat.sektor = this.namaSektorSelected;
    giat.namaKegiatan = this.giatForm.value['namaKegiatan'];
    giat.sumberDana = this.giatForm.value['sumberDana'];
    giat.instansi = this.giatForm.value['instansi'];
    giat.paguAnggaran = this.giatForm.value['paguAnggaran'];
    giat.nomorSuratPermohonan = this.giatForm.value['nomorSuratPermohonan'];
    giat.tanggalSuratPermohonan = dateTanggalSuratPermohonan;
    giat.tempatPemaparan = this.giatForm.value['tempatPemaparan'];
    giat.tanggalPemaparan = dateTanggalPemaparan;
    giat.telaahanIntelijen = this.giatForm.value['telaahanIntelijen'];
    giat.tindakLanjut = this.giatForm.value['tindakLanjut'];
    giat.tindakLanjutKeterangan = this.giatForm.value['tindakLanjutKeterangan'];
    giat.nomorSprintWalpam = this.giatForm.value['nomorSprintWalpam'];
    giat.tanggalSprintWalpam = dateTanggalSprintWalpam;
    giat.namaPetugasPelaksana = this.giatForm.value['namaPetugasPelaksana'];
    giat.nilaiKontrak = this.giatForm.value['nilaiKontrak'];
    giat.hasilPelaksanaan = this.giatForm.value['hasilPelaksanaan'];
    giat.hasilPelaksanaanKeterangan = this.giatForm.value['hasilPelaksanaanKeterangan'];
    giat.nomorKertasKerja = this.giatForm.value['nomorKertasKerja'];
    giat.tanggalKertasKerja = dateTanggalKertasKerja;
    giat.keterangan = this.giatForm.value['keterangan'];
    giat.urlFile = this.giatForm.value['urlFile'];

    if (this.isEditMode) {
     this.giatSub = this.giatService.update(giat, this.id).subscribe({
        next: () => {
          this.isLoading = false;
          this.message = 'UpdateSukses';
          this.onNotificationStatusChange(true);
          this.onCancel();
        },
        error: (errorMessage) => {
          this.error = errorMessage;
          this.isLoading = false;
          this.onNotificationStatusChange(false);
        }
      });
    } else {
      this.giatSub = this.giatService.create(giat).subscribe({
        next: () => {
          // console.log(responseData);
          this.isLoading = false;
          this.message = 'SimpanSukses';
          this.onNotificationStatusChange(true);
          this.onCancel();
        },
        error: (errorMessage) => {
          this.error = errorMessage;
          this.isLoading = false;
          this.onNotificationStatusChange(false);
        }
      });
    }
  }

  sektorChange(value: string) {
    this.namaSektorSelected = value;
  }

  tindakLanjutChange(value: boolean) {
    if (value) {
      this.tindakLanjutValue = true;
    } else {
      this.tindakLanjutValue = false
    }
  }

  tindakPelaksanaanChange(value: string) {
    if (value === this.pelaksanaanList[0]) {
      this.pelaksanaanSelected = this.pelaksanaanList[0];
    } else if (value === this.pelaksanaanList[1]) {
      this.pelaksanaanSelected = this.pelaksanaanList[1];
    } else if (value === this.pelaksanaanList[2]) {
      this.pelaksanaanSelected = this.pelaksanaanList[2];
    }
  }

  onDateTanggalSuratPermohonanSelect(date: NgbDate) {
    this.modelDateTanggalSuratPermohonan = date;
  }

  onDateTanggalSprintWalpamSelect(date: NgbDate) {
    this.modelDateTanggalSprintWalpam = date;
  }

  onDateTanggalPemaparanSelect(date: NgbDate) {
    this.modelDateTanggalPemaparan = date;
  }

  onDateTanggalKertasKerjaSelect(date: NgbDate) {
    this.modelDateTanggalKertasKerja = date;
  }

  onCancel() {
    this.giatForm.reset();
    this.router.navigate(['/kegiatan', 'list', 'pamstra-list'], {
      queryParams: {
        bidang: this.namaBidang,
        message: this.message
      }
    });
  }

  onNotificationStatusChange(status: boolean){
    this.notificationStatusService.changeNotificationStatus(status);
  }

  ngOnDestroy(): void {
    if (this.giatFormSub) {
      this.giatFormSub.unsubscribe();
    }
    if (this.giatSub) {
      this.giatSub.unsubscribe();
    }
    if (this.giatParamSub) {
      this.giatParamSub.unsubscribe();
    }
    if (this.giatQueryParamSub) {
      this.giatQueryParamSub.unsubscribe();
    }
  }

}
