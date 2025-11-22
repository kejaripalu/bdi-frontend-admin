import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { min, Subscription } from 'rxjs';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { SuratMasuk } from '../surat-masuk.model';
import { SuratMasukService } from '../surat-masuk.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
    selector: 'app-surat-masuk-form',
    templateUrl: './surat-masuk-form.component.html',
    styleUrls: ['./surat-masuk-form.component.css'],
    standalone: false
})
export class SuratMasukFormComponent implements OnInit, OnDestroy {
  suratMasukForm!: UntypedFormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private suratMasukFormSub!: Subscription;
  private suratMasukSub!: Subscription;
  private suratMasukParamSub!: Subscription;
  private suratMasukQueryParamSub!: Subscription;
  private id: string = null as any;
  jenisSurat: string = null as any;
  message: string = null as any;
  currentNotificationStatus: boolean = false;

  modelDateTanggalPenerimaanSurat: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalSurat: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(
    private suratMasukService: SuratMasukService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.modelDateTanggalPenerimaanSurat = this.calendar.getToday();
    this.modelDateTanggalSurat = this.calendar.getToday();
    this.suratMasukParamSub = this.route.params
      .subscribe((params: Params) => {
        this.isEditMode = params['id'] != null;
        this.id = params['id'];
      });
    this.suratMasukQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        this.jenisSurat = queryParams['jenisSurat']?.toUpperCase() !== 'RAHASIA' ? 'BIASA' : 'RAHASIA';
      });
    this.initForm();
    this.suratMasukFormSub = this.suratMasukForm.statusChanges.subscribe(
      // (status) => console.log(status)
    );
    this.notificationStatusService.currentNotificationStatus.subscribe(notification => this.currentNotificationStatus = notification);
  }

  onSubmit() {
    this.isLoading = true;
    this.error = null as any;
    const dateTanggalPenerimaanSurat = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalPenerimaanSurat.year,
      this.modelDateTanggalPenerimaanSurat.month,
      this.modelDateTanggalPenerimaanSurat.day);
    const dateTanggalSurat = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalSurat.year,
      this.modelDateTanggalSurat.month,
      this.modelDateTanggalSurat.day);

      const suratMasuk = new SuratMasuk();
      suratMasuk.tanggalPenerimaanSurat = dateTanggalPenerimaanSurat;
      suratMasuk.jamPenerimaanSurat = this.suratMasukForm.value['jamPenerimaanSurat'];
      suratMasuk.asal = this.suratMasukForm.value['asal'];
      suratMasuk.nomorSurat = this.suratMasukForm.value['nomorSurat'];
      suratMasuk.tanggalSurat = dateTanggalSurat;
      suratMasuk.perihal = this.suratMasukForm.value['perihal'];
      suratMasuk.jenisSurat = this.jenisSurat;
      suratMasuk.isiDisposisi = this.suratMasukForm.value['isiDisposisi'];
      suratMasuk.tindakLanjutDisposisi = this.suratMasukForm.value['tindakLanjutDisposisi'];
      suratMasuk.keterangan = this.suratMasukForm.value['keterangan'];
      suratMasuk.urlFile = this.suratMasukForm.value['urlFile'];
      
      if (this.isEditMode) {
      this.suratMasukSub = this.suratMasukService.updateSuratMasuk(suratMasuk, this.id).subscribe({
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
      this.suratMasukSub = this.suratMasukService.createSuratMasuk(suratMasuk).subscribe({
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
    this.suratMasukForm.reset();
    if (this.jenisSurat === 'RAHASIA') {
      this.router.navigate(['/surat-masuk', 'rahasia'], { queryParams: { jenisSurat: 'RAHASIA', message: this.message } });
    } else {
      this.router.navigate(['/surat-masuk', 'biasa'], { queryParams: { jenisSurat: 'BIASA', message: this.message } });
    }
  }

  private initForm() {
    let jamPenerimaanSurat = this.currentDateTimeService.getCurrentTime();
    
    this.suratMasukForm = new UntypedFormGroup({
      'tanggalPenerimaanSurat': new UntypedFormControl(this.modelDateTanggalPenerimaanSurat, [Validators.required, Validators.minLength(10)]),
      'jamPenerimaanSurat': new UntypedFormControl(jamPenerimaanSurat, [Validators.required, Validators.minLength(5)]),
      'asal': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'nomorSurat': new UntypedFormControl(null as any, [Validators.required, Validators.maxLength(255)]),
      'perihal': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'tanggalSurat': new UntypedFormControl(this.modelDateTanggalSurat, [Validators.required, Validators.minLength(10)]),
      'isiDisposisi': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'tindakLanjutDisposisi': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'keterangan': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'urlFile': new UntypedFormControl(null as any)
    });

    if (this.isEditMode) {
      this.isLoadingEditForm = true;
      this.suratMasukSub = this.suratMasukService.getOneSuratMasuk(this.id).subscribe({
        next: (suratMasuk) => {
          this.modelDateTanggalPenerimaanSurat = {
            year: +suratMasuk.tanggalPenerimaanSurat.slice(0, 4),
            month: +suratMasuk.tanggalPenerimaanSurat.slice(5, 7),
            day: +suratMasuk.tanggalPenerimaanSurat.slice(8, 10)
          };
          this.modelDateTanggalSurat = {
            year: +suratMasuk.tanggalSurat.slice(0, 4),
            month: +suratMasuk.tanggalSurat.slice(5, 7),
            day: +suratMasuk.tanggalSurat.slice(8, 10)
          };

          this.suratMasukForm = new UntypedFormGroup({
            'tanggalPenerimaanSurat': new UntypedFormControl(this.modelDateTanggalPenerimaanSurat, [Validators.required, Validators.minLength(10)]),
            'jamPenerimaanSurat': new UntypedFormControl(suratMasuk.jamPenerimaanSurat, [Validators.required, Validators.minLength(5)]),
            'asal': new UntypedFormControl(suratMasuk.asal, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'nomorSurat': new UntypedFormControl(suratMasuk.nomorSurat, [Validators.required, Validators.maxLength(255)]),
            'perihal': new UntypedFormControl(suratMasuk.perihal, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'tanggalSurat': new UntypedFormControl(this.modelDateTanggalSurat, [Validators.required, Validators.minLength(10)]),
            'isiDisposisi': new UntypedFormControl(suratMasuk.isiDisposisi, Validators.maxLength(255)),
            'tindakLanjutDisposisi': new UntypedFormControl(suratMasuk.tindakLanjutDisposisi, Validators.maxLength(255)),
            'keterangan': new UntypedFormControl(suratMasuk.keterangan, Validators.maxLength(255)),
            'urlFile': new UntypedFormControl(suratMasuk.urlFile)
          });
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

  onDateTanggalPenerimaanSelect(date: NgbDate) {
    this.modelDateTanggalPenerimaanSurat = date;
  }

  onDateTanggalSuratSelect(date: NgbDate) {
    this.modelDateTanggalSurat = date;
  }

  onNotificationStatusChange(status: boolean){
    this.notificationStatusService.changeNotificationStatus(status);
  }

  ngOnDestroy(): void {
    if (this.suratMasukFormSub) {
      this.suratMasukFormSub.unsubscribe();
    }
    if (this.suratMasukSub) {
      this.suratMasukSub.unsubscribe();
    }
    if (this.suratMasukParamSub) {
      this.suratMasukParamSub.unsubscribe();
    }
    if (this.suratMasukQueryParamSub) {
      this.suratMasukQueryParamSub.unsubscribe();
    }
  }

}
