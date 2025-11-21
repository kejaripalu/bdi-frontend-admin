import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { PenkuluhkumService } from '../penkuluhkum.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { RegisterPenkumLuhkum } from '../penkumluhkum.model';

@Component({
  selector: 'app-penkumluhkum-form',
  templateUrl: './penkumluhkum-form.component.html',
  styleUrls: ['./penkumluhkum-form.component.css']
})
export class PenkumluhkumFormComponent implements OnInit, OnDestroy {
  penkumluhkumForm!: UntypedFormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private penkumluhkumFormSub!: Subscription;
  private penkumluhkumSub!: Subscription;
  private penkumluhkumParamSub!: Subscription;
  private penkumluhkumQueryParamSub!: Subscription;
  private id: string = null as any;
  jenisKegiatan: string = null as any;
  program: string = null as any;
  message: string = null as any;
  currentNotificationStatus: boolean = false;
  minNumber = 0;
  maxNumber = 2147483647;
  urlFoto1: string = null as any;
  urlFoto2: string = null as any;
  urlFoto3: string = null as any;
  urlFoto4: string = null as any;

  modelDateTanggalSuratPerintah: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalKegiatan: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(
    private penkumluhkumService: PenkuluhkumService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.modelDateTanggalSuratPerintah = this.calendar.getToday();
    this.modelDateTanggalKegiatan = this.calendar.getToday();
    this.program = 'BINMATKUM';
    this.penkumluhkumParamSub = this.route.params
      .subscribe((params: Params) => {
        this.isEditMode = params['id'] != null;
        this.id = params['id'];
      });
    this.penkumluhkumQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        this.jenisKegiatan = queryParams['jenisKegiatan']?.toUpperCase() !== 'PENYULUHAN_HUKUM' ? 'PENERANGAN_HUKUM' : 'PENYULUHAN_HUKUM';
      });
    this.initForm();
    this.penkumluhkumFormSub = this.penkumluhkumForm.statusChanges.subscribe(
      // (status) => console.log(status)
    );
    this.notificationStatusService.currentNotificationStatus.subscribe(notification => this.currentNotificationStatus = notification);
  }

  private initForm() {
    this.penkumluhkumForm = new UntypedFormGroup({
      'nomorSuratPerintah': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'tanggalSuratPerintah': new UntypedFormControl(this.modelDateTanggalSuratPerintah, [Validators.required, Validators.minLength(10)]),
      'tempat': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'tanggalKegiatan': new UntypedFormControl(this.modelDateTanggalKegiatan, [Validators.required, Validators.minLength(10)]),
      'sasaranKegiatan': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'materi': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'jumlahPeserta': new UntypedFormControl(this.minNumber, [Validators.required, Validators.min(this.minNumber), Validators.max(this.maxNumber)]),
      'keterangan': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'urlFoto1': new UntypedFormControl(null as any),
      'urlFoto2': new UntypedFormControl(null as any),
      'urlFoto3': new UntypedFormControl(null as any),
      'urlFoto4': new UntypedFormControl(null as any)
    });

    if (this.isEditMode) {
      this.isLoadingEditForm = true;
      this.penkumluhkumSub = this.penkumluhkumService.getOne(this.id).subscribe({
        next: (penkumluhkum) => {
          this.modelDateTanggalSuratPerintah = {
            year: +penkumluhkum.tanggalSuratPerintah.slice(0, 4),
            month: +penkumluhkum.tanggalSuratPerintah.slice(5, 7),
            day: +penkumluhkum.tanggalSuratPerintah.slice(8, 10)
          };
          this.modelDateTanggalKegiatan = {
            year: +penkumluhkum.tanggalKegiatan.slice(0, 4),
            month: +penkumluhkum.tanggalKegiatan.slice(5, 7),
            day: +penkumluhkum.tanggalKegiatan.slice(8, 10)
          };

          this.penkumluhkumForm = new UntypedFormGroup({
            'nomorSuratPerintah': new UntypedFormControl(penkumluhkum.nomorSuratPerintah, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'tanggalSuratPerintah': new UntypedFormControl(this.modelDateTanggalSuratPerintah, [Validators.required, Validators.minLength(10)]),
            'tempat': new UntypedFormControl(penkumluhkum.tempat, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'tanggalKegiatan': new UntypedFormControl(this.modelDateTanggalKegiatan, [Validators.required, Validators.minLength(10)]),
            'sasaranKegiatan': new UntypedFormControl(penkumluhkum.sasaranKegiatan, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'materi': new UntypedFormControl(penkumluhkum.materi, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'jumlahPeserta': new UntypedFormControl(penkumluhkum.jumlahPeserta, [Validators.required, Validators.min(this.minNumber), Validators.max(this.maxNumber)]),
            'keterangan': new UntypedFormControl(penkumluhkum.keterangan, Validators.maxLength(255)),
            'urlFoto1': new UntypedFormControl(penkumluhkum.urlFoto1),
            'urlFoto2': new UntypedFormControl(penkumluhkum.urlFoto2),
            'urlFoto3': new UntypedFormControl(penkumluhkum.urlFoto3),
            'urlFoto4': new UntypedFormControl(penkumluhkum.urlFoto4)
          });
          this.isLoadingEditForm = false;
          this.editModeError = false;
          this.urlFoto1 = penkumluhkum.urlFoto1 != null ? (penkumluhkum.urlFoto1 == '' ? null as any : penkumluhkum.urlFoto1) : null as any;
          this.urlFoto2 = penkumluhkum.urlFoto2 != null ? (penkumluhkum.urlFoto2 == '' ? null as any : penkumluhkum.urlFoto2) : null as any;
          this.urlFoto3 = penkumluhkum.urlFoto3 != null ? (penkumluhkum.urlFoto3 == '' ? null as any : penkumluhkum.urlFoto3) : null as any;
          this.urlFoto4 = penkumluhkum.urlFoto4 != null ? (penkumluhkum.urlFoto4 == '' ? null as any : penkumluhkum.urlFoto4) : null as any;          
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
    const dateTanggalSuratPerintah = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalSuratPerintah.year,
      this.modelDateTanggalSuratPerintah.month,
      this.modelDateTanggalSuratPerintah.day);
    const dateTanggalKegiatan = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalKegiatan.year,
      this.modelDateTanggalKegiatan.month,
      this.modelDateTanggalKegiatan.day);

    const penkumluhkum = new RegisterPenkumLuhkum();
    penkumluhkum.jenisKegiatan = this.jenisKegiatan;
    penkumluhkum.program = this.program;
    penkumluhkum.nomorSuratPerintah = this.penkumluhkumForm.value['nomorSuratPerintah'];
    penkumluhkum.tanggalSuratPerintah = dateTanggalSuratPerintah;
    penkumluhkum.tempat = this.penkumluhkumForm.value['tempat'];
    penkumluhkum.tanggalKegiatan = dateTanggalKegiatan;
    penkumluhkum.sasaranKegiatan = this.penkumluhkumForm.value['sasaranKegiatan'];
    penkumluhkum.materi = this.penkumluhkumForm.value['materi'];
    penkumluhkum.jumlahPeserta = this.penkumluhkumForm.value['jumlahPeserta'];
    penkumluhkum.keterangan = this.penkumluhkumForm.value['keterangan'];
    penkumluhkum.urlFoto1 = this.penkumluhkumForm.value['urlFoto1'];
    penkumluhkum.urlFoto2 = this.penkumluhkumForm.value['urlFoto2'];
    penkumluhkum.urlFoto3 = this.penkumluhkumForm.value['urlFoto3'];
    penkumluhkum.urlFoto4 = this.penkumluhkumForm.value['urlFoto4'];

    if (this.isEditMode) {
      this.penkumluhkumSub = this.penkumluhkumService.update(penkumluhkum, this.id).subscribe({
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
      this.penkumluhkumSub = this.penkumluhkumService.create(penkumluhkum).subscribe({
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

  onCancel() {
    this.penkumluhkumForm.reset();
    if (this.jenisKegiatan === 'PENYULUHAN_HUKUM') {
      this.router.navigate(['/penkumluhkum', 'luhkum'], { queryParams: { jenisKegiatan: 'PENYULUHAN_HUKUM', message: this.message } });
    } else {
      this.router.navigate(['/penkumluhkum', 'penkum'], { queryParams: { jenisKegiatan: 'PENERANGAN_HUKUM', message: this.message } });
    }
  }

  onDateTanggalSuratPerintahSelect(date: NgbDate) {
    this.modelDateTanggalSuratPerintah = date;
  }

  onDateTanggalKegiatanSelect(date: NgbDate) {
    this.modelDateTanggalKegiatan = date;
  }

  onProgramChange(program: string) {
    this.program = program;
  }

  onNotificationStatusChange(status: boolean) {
    this.notificationStatusService.changeNotificationStatus(status);
  }

  ngOnDestroy(): void {
    if (this.penkumluhkumFormSub) {
      this.penkumluhkumFormSub.unsubscribe();
    }
    if (this.penkumluhkumSub) {
      this.penkumluhkumSub.unsubscribe();
    }
    if (this.penkumluhkumParamSub) {
      this.penkumluhkumParamSub.unsubscribe();
    }
    if (this.penkumluhkumQueryParamSub) {
      this.penkumluhkumQueryParamSub.unsubscribe();
    }
  }

}
