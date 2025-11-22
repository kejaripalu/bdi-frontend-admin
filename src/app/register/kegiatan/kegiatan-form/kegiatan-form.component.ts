import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { Sektor } from 'src/app/shared/bidang-direktorat/sektor';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { RegisterKegiatanIntelijen } from '../kegiatan.model';
import { RegisterKegiatanIntelijenService } from '../kegiatan.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
    selector: 'app-kegiatan-form',
    templateUrl: './kegiatan-form.component.html',
    styleUrls: ['./kegiatan-form.component.css'],
    standalone: false
})
export class KegiatanFormComponent implements OnInit, OnDestroy {
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
  indexBidang!: number;
  message: string = null as any;
  sektorList: Sektor[] = [];
  namaSektorSelected: string = null as any;
  currentNotificationStatus: boolean = false;

  modelDateTanggal: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(
    private giatService: RegisterKegiatanIntelijenService,
    private bidangDirektoratSektorService: BidangDirektoratSektorService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.modelDateTanggal = this.calendar.getToday();
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
        // if index not found set to index 0 (IPOLHANKAM)
        if (this.indexBidang < 0) {
          this.indexBidang = 0;
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
    this.giatForm = new UntypedFormGroup({
      'nomor': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'tanggal': new UntypedFormControl(this.modelDateTanggal, [Validators.required, Validators.minLength(10)]),
      'perihal': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]),
      'namaPetugasPelaksana': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(3)]),
      'hasilPelaksanaanKegiatan': new UntypedFormControl(null as any),
      'keterangan': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'urlFile': new UntypedFormControl(null as any)
    });

    if (this.namaBidang === 'IPOLHANKAM') {
      for (let i = 0; i < 13; i++) {
        this.sektorList.push(
          {
            deskripsiSektor: this.bidangDirektoratSektorService.getSektor()[i].deskripsiSektor!,
            namaSektor: this.bidangDirektoratSektorService.getSektor()[i].namaSektor!
          });
      }
      this.namaSektorSelected = this.sektorList[0].namaSektor!;
    } else if (this.namaBidang === 'SOSBUDMAS') {
      for (let i = 13; i < 25; i++) {
        this.sektorList.push(
          {
            deskripsiSektor: this.bidangDirektoratSektorService.getSektor()[i].deskripsiSektor!,
            namaSektor: this.bidangDirektoratSektorService.getSektor()[i].namaSektor!
          });
      }
      this.namaSektorSelected = this.sektorList[0].namaSektor!;
    } else if (this.namaBidang === 'EKOKEU') {
      for (let i = 25; i < 41; i++) {
        this.sektorList.push(
          {
            deskripsiSektor: this.bidangDirektoratSektorService.getSektor()[i].deskripsiSektor!,
            namaSektor: this.bidangDirektoratSektorService.getSektor()[i].namaSektor!
          });
      }
      this.namaSektorSelected = this.sektorList[0].namaSektor!;
    } else if (this.namaBidang === 'PAMSTRA') {
      for (let i = 41; i < 61; i++) {
        this.sektorList.push(
          {
            deskripsiSektor: this.bidangDirektoratSektorService.getSektor()[i].deskripsiSektor!,
            namaSektor: this.bidangDirektoratSektorService.getSektor()[i].namaSektor!
          });
      }
      this.namaSektorSelected = this.sektorList[0].namaSektor!;
    } else if (this.namaBidang === 'TIPRODIN') {
      for (let i = 61; i < 75; i++) {
        this.sektorList.push(
          {
            deskripsiSektor: this.bidangDirektoratSektorService.getSektor()[i].deskripsiSektor!,
            namaSektor: this.bidangDirektoratSektorService.getSektor()[i].namaSektor!
          });
      }
      this.namaSektorSelected = this.sektorList[0].namaSektor!;
    }

    if (this.isEditMode) {
      this.isLoadingEditForm = true;
      this.giatSub = this.giatService.getOne(this.id).subscribe({
        next: (giat) => {
          this.modelDateTanggal = {
            year: +giat.tanggal.slice(0, 4),
            month: +giat.tanggal.slice(5, 7),
            day: +giat.tanggal.slice(8, 10)
          };

          this.giatForm = new UntypedFormGroup({
            'nomor': new UntypedFormControl(giat.nomor, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'tanggal': new UntypedFormControl(this.modelDateTanggal, [Validators.required, Validators.minLength(10)]),
            'perihal': new UntypedFormControl(giat.perihal, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]),
            'namaPetugasPelaksana': new UntypedFormControl(giat.namaPetugasPelaksana, [Validators.required, Validators.minLength(3)]),
            'hasilPelaksanaanKegiatan': new UntypedFormControl(giat.hasilPelaksanaanKegiatan),
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
    const dateTanggal = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggal.year,
      this.modelDateTanggal.month,
      this.modelDateTanggal.day);

    const giat = new RegisterKegiatanIntelijen();
    giat.bidangDirektorat = this.namaBidang;
    giat.sektor = this.namaSektorSelected;
    giat.nomor = this.giatForm.value['nomor'];
    giat.tanggal = dateTanggal;
    giat.perihal = this.giatForm.value['perihal'];
    giat.namaPetugasPelaksana = this.giatForm.value['namaPetugasPelaksana'];
    giat.hasilPelaksanaanKegiatan = this.giatForm.value['hasilPelaksanaanKegiatan'];
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

  onDateTanggalSelect(date: NgbDate) {
    this.modelDateTanggal = date;
  }

  onCancel() {
    this.giatForm.reset();
    this.router.navigate(['/kegiatan', 'list'], {
      queryParams: {
        bidang: this.namaBidang,
        message: this.message
      }
    });
  }

  onNotificationStatusChange(status: boolean) {
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
