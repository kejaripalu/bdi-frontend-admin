import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { SuratKeluar } from '../surat-keluar.model';
import { SuratKeluarService } from '../surat-keluar.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-surat-keluar-form',
  templateUrl: './surat-keluar-form.component.html',
  styleUrls: ['./surat-keluar-form.component.css']
})
export class SuratKeluarFormComponent implements OnInit, OnDestroy {
  suratKeluarForm!: UntypedFormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private suratKeluarFormSub!: Subscription;
  private suratKeluarSub!: Subscription;
  private suratKeluarParamSub!: Subscription;
  private suratKeluarQueryParamSub!: Subscription;
  private id: string = null as any;
  jenisSurat: string = null as any;
  message: string = null as any;
  currentNotificationStatus: boolean = false;

  modelDate: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(
    private suratKeluarService: SuratKeluarService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.modelDate = this.calendar.getToday();
    this.suratKeluarParamSub = this.route.params
      .subscribe((params: Params) => {
        this.isEditMode = params['id'] != null;
        this.id = params['id'];
      });
    this.suratKeluarQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        this.jenisSurat = queryParams['jenisSurat']?.toUpperCase() !== 'R' ? 'BIASA' : 'RAHASIA';
      });
    this.initForm();
    this.suratKeluarFormSub = this.suratKeluarForm.statusChanges.subscribe(
      // (status) => console.log(status)
    );
    this.notificationStatusService.currentNotificationStatus.subscribe(notification => this.currentNotificationStatus = notification);
  }

  initForm() {
    this.suratKeluarForm = new UntypedFormGroup({
      'tanggalSurat': new UntypedFormControl(this.modelDate, [Validators.required, Validators.minLength(10)]),
      'nomorSurat': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'kepada': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'perihal': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'lampiran': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'keterangan': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'urlFile': new UntypedFormControl(null as any)
    });

    if (this.isEditMode) {
      this.isLoadingEditForm = true;
      this.suratKeluarSub = this.suratKeluarService.getOneSuratKeluar(this.id).subscribe({
        next: (suratKeluar) => {
          this.modelDate = {
            year: +suratKeluar.tanggalSurat.slice(0, 4),
            month: +suratKeluar.tanggalSurat.slice(5, 7),
            day: +suratKeluar.tanggalSurat.slice(8, 10)
          };
          this.suratKeluarForm = new UntypedFormGroup({
            'tanggalSurat': new UntypedFormControl(this.modelDate, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]),
            'nomorSurat': new UntypedFormControl(suratKeluar.nomorSurat, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'kepada': new UntypedFormControl(suratKeluar.kepada, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'perihal': new UntypedFormControl(suratKeluar.perihal, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'lampiran': new UntypedFormControl(suratKeluar.lampiran, Validators.maxLength(255)),
            'keterangan': new UntypedFormControl(suratKeluar.keterangan, Validators.maxLength(255)),
            'urlFile': new UntypedFormControl(suratKeluar.urlFile)
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

  onSubmit() {
    this.isLoading = true;
    this.error = null as any;
    const date = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDate.year, this.modelDate.month, this.modelDate.day);

    const suratKeluar = new SuratKeluar();
    suratKeluar.tanggalSurat = date;
    suratKeluar.nomorSurat = this.suratKeluarForm.value['nomorSurat'];
    suratKeluar.kepada = this.suratKeluarForm.value['kepada'];
    suratKeluar.perihal = this.suratKeluarForm.value['perihal'];
    suratKeluar.lampiran = this.suratKeluarForm.value['lampiran'];
    suratKeluar.keterangan = this.suratKeluarForm.value['keterangan'];
    suratKeluar.urlFile = this.suratKeluarForm.value['urlFile'];
    suratKeluar.jenisSurat = this.jenisSurat;

    if (this.isEditMode) {
      this.suratKeluarSub = this.suratKeluarService.updateSuratKeluar(suratKeluar, this.id).subscribe({
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
      this.suratKeluarSub = this.suratKeluarService.createSuratKeluar(suratKeluar).subscribe({
        next: () => {
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

  onDateSelect(date: NgbDate) {
    this.modelDate = date;
  }

  onCancel() {
    this.suratKeluarForm.reset();
    if (this.jenisSurat === 'RAHASIA') {
      this.router.navigate(['/surat-keluar', 'rahasia'], { queryParams: { jenisSurat: 'R', message: this.message } });
    } else {
      this.router.navigate(['/surat-keluar', 'biasa'], { queryParams: { jenisSurat: 'B', message: this.message } });
    }
  }

  onNotificationStatusChange(status: boolean){
    this.notificationStatusService.changeNotificationStatus(status);
  }

  ngOnDestroy(): void {
    if (this.suratKeluarFormSub) {
      this.suratKeluarFormSub.unsubscribe();
    }
    if (this.suratKeluarSub) {
      this.suratKeluarSub.unsubscribe();
    }
    if (this.suratKeluarParamSub) {
      this.suratKeluarParamSub.unsubscribe();
    }
    if (this.suratKeluarQueryParamSub) {
      this.suratKeluarQueryParamSub.unsubscribe();
    }
  }

}
