import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { Ekspedisi } from '../ekspedisi.model';
import { EkspedisiService } from '../ekspedisi.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
    selector: 'app-ekspedisi-form',
    templateUrl: './ekspedisi-form.component.html',
    styleUrls: ['./ekspedisi-form.component.css'],
    standalone: false
})
export class EkspedisiFormComponent implements OnInit, OnDestroy {
  ekspedisiForm!: UntypedFormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private ekspedisiFormSub!: Subscription;
  private ekspedisiSub!: Subscription;
  private ekspedisiParamSub!: Subscription;
  private ekspedisiQueryParamSub!: Subscription;
  private id: string = null as any;
  jenisSurat: string = null as any;
  message: string = null as any;
  currentNotificationStatus: boolean = false;

  modelDateTanggalSurat: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalTerimaSurat: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(
    private ekspedisiService: EkspedisiService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.modelDateTanggalSurat = this.calendar.getToday();
    this.modelDateTanggalTerimaSurat = this.calendar.getToday();
    this.ekspedisiParamSub = this.route.params
      .subscribe((params: Params) => {
        this.isEditMode = params['id'] != null;
        this.id = params['id'];
      });
    this.ekspedisiQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        this.jenisSurat = queryParams['jenisSurat']?.toUpperCase() !== 'RAHASIA' ? 'BIASA' : 'RAHASIA';
      });
    this.initForm();
    this.ekspedisiFormSub = this.ekspedisiForm.statusChanges.subscribe(
      // (status) => console.log(status)
    );
    this.notificationStatusService.currentNotificationStatus.subscribe(notification => this.currentNotificationStatus = notification);
  }

  initForm() {
    let jamTandaTerima = this.currentDateTimeService.getCurrentTime();

    this.ekspedisiForm = new UntypedFormGroup({
      'nomorSurat': new UntypedFormControl(null as any, [Validators.required, Validators.maxLength(255)]),
      'tanggalSurat': new UntypedFormControl(this.modelDateTanggalSurat, [Validators.required, Validators.minLength(10)]),
      'kepada': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'perihal': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'lampiran': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'tanggalTandaTerima': new UntypedFormControl(this.modelDateTanggalTerimaSurat, [Validators.required, Validators.minLength(10)]),
      'jamTandaTerima': new UntypedFormControl(jamTandaTerima, [Validators.required, Validators.minLength(5)]),
      'namaDanParaf': new UntypedFormControl(null as any),
      'keterangan': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'urlFile': new UntypedFormControl(null as any)
    });

    if (this.isEditMode) {
      this.isLoadingEditForm = true;
      this.ekspedisiSub = this.ekspedisiService.getOneEkspedisi(this.id).subscribe({
        next: (ekspedisi) => {
          this.modelDateTanggalSurat = {
            year: +ekspedisi.tanggalSurat.slice(0, 4),
            month: +ekspedisi.tanggalSurat.slice(5, 7),
            day: +ekspedisi.tanggalSurat.slice(8, 10)
          };
          this.modelDateTanggalTerimaSurat = {
            year: +ekspedisi.tanggalTandaTerima.slice(0, 4),
            month: +ekspedisi.tanggalTandaTerima.slice(5, 7),
            day: +ekspedisi.tanggalTandaTerima.slice(8, 10)
          };

          this.ekspedisiForm = new UntypedFormGroup({
            'nomorSurat': new UntypedFormControl(ekspedisi.nomorSurat, [Validators.required, Validators.maxLength(255)]),
            'tanggalSurat': new UntypedFormControl(this.modelDateTanggalSurat, [Validators.required, Validators.minLength(10)]),
            'kepada': new UntypedFormControl(ekspedisi.kepada, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'perihal': new UntypedFormControl(ekspedisi.perihal, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'lampiran': new UntypedFormControl(ekspedisi.lampiran, Validators.maxLength(255)),
            'tanggalTandaTerima': new UntypedFormControl(this.modelDateTanggalTerimaSurat, [Validators.required, Validators.minLength(10)]),
            'jamTandaTerima': new UntypedFormControl(ekspedisi.jamTandaTerima, [Validators.required, Validators.minLength(5)]),
            'namaDanParaf': new UntypedFormControl(ekspedisi.namaDanParaf),
            'keterangan': new UntypedFormControl(ekspedisi.keterangan, Validators.maxLength(255)),
            'urlFile': new UntypedFormControl(ekspedisi.urlFile)
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
    const dateTanggalSurat = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalSurat.year,
      this.modelDateTanggalSurat.month,
      this.modelDateTanggalSurat.day);
    const dateTanggalTandaTerima = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalTerimaSurat.year,
      this.modelDateTanggalTerimaSurat.month,
      this.modelDateTanggalTerimaSurat.day);

    const ekspedisi = new Ekspedisi();
    ekspedisi.nomorSurat = this.ekspedisiForm.value['nomorSurat'];
    ekspedisi.tanggalSurat = dateTanggalSurat;
    ekspedisi.kepada = this.ekspedisiForm.value['kepada'];
    ekspedisi.perihal = this.ekspedisiForm.value['perihal'];
    ekspedisi.lampiran = this.ekspedisiForm.value['lampiran'];
    ekspedisi.tanggalTandaTerima = dateTanggalTandaTerima;
    ekspedisi.jamTandaTerima = this.ekspedisiForm.value['jamTandaTerima'];
    ekspedisi.jenisSurat = this.jenisSurat;
    ekspedisi.namaDanParaf = this.ekspedisiForm.value['namaDanParaf'];
    ekspedisi.keterangan = this.ekspedisiForm.value['keterangan'];
    ekspedisi.urlFile = this.ekspedisiForm.value['urlFile'];

    if (this.isEditMode) {
      this.ekspedisiSub = this.ekspedisiService.updateEkspedisi(ekspedisi, this.id).subscribe({
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
      this.ekspedisiSub = this.ekspedisiService.createEkspedisi(ekspedisi).subscribe({
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
    this.ekspedisiForm.reset();
    if (this.jenisSurat === 'RAHASIA') {
      this.router.navigate(['/ekspedisi', 'rahasia'], { queryParams: { jenisSurat: 'RAHASIA', message: this.message } });
    } else {
      this.router.navigate(['/ekspedisi', 'biasa'], { queryParams: { jenisSurat: 'BIASA', message: this.message } });
    }
  }

  onDateTanggalSuratSelect(date: NgbDate) {
    this.modelDateTanggalSurat = date;
  }

  onDateTanggalTandaTerimaSelect(date: NgbDate) {
    this.modelDateTanggalTerimaSurat = date;
  }

  onNotificationStatusChange(status: boolean) {
    this.notificationStatusService.changeNotificationStatus(status);
  }

  ngOnDestroy(): void {
    if (this.ekspedisiFormSub) {
      this.ekspedisiFormSub.unsubscribe();
    }
    if (this.ekspedisiSub) {
      this.ekspedisiSub.unsubscribe();
    }
    if (this.ekspedisiParamSub) {
      this.ekspedisiParamSub.unsubscribe();
    }
    if (this.ekspedisiQueryParamSub) {
      this.ekspedisiQueryParamSub.unsubscribe();
    }
  }

}
