import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { RegisterTelaahanIntelijenService } from '../lahin.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { RegisterLahin } from '../lahin.model';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
    selector: 'app-lahin-form',
    templateUrl: './lahin-form.component.html',
    styleUrls: ['./lahin-form.component.css'],
    standalone: false
})
export class LahinFormComponent implements OnInit, OnDestroy {
  lahinForm!: UntypedFormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private lahinFormSub!: Subscription;
  private lahinSub!: Subscription;
  private lahinParamSub!: Subscription;
  private id: string = null as any;
  jenisSurat: string = null as any;
  message: string = null as any;
  currentNotificationStatus: boolean = false;

  modelDateTanggalLahin: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(
    private lahinService: RegisterTelaahanIntelijenService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.modelDateTanggalLahin = this.calendar.getToday();
    this.lahinParamSub = this.route.params
      .subscribe((params: Params) => {
        this.isEditMode = params['id'] != null;
        this.id = params['id'];
      });
    this.initForm();
    this.lahinFormSub = this.lahinForm.statusChanges.subscribe(
      // (status) => console.log(status)
    );
    this.notificationStatusService.currentNotificationStatus.subscribe(notification => this.currentNotificationStatus = notification);
  }

  initForm() {
    this.lahinForm = new UntypedFormGroup({
      'nomor': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'tanggal': new UntypedFormControl(this.modelDateTanggalLahin, [Validators.required, Validators.minLength(10)]),
      'pembuat': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'perihal': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'lampiran': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'tindakLanjut': new UntypedFormControl(null as any),
      'keterangan': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'urlFile': new UntypedFormControl(null as any)
    });

    if (this.isEditMode) {
      this.isLoadingEditForm = true;
      this.lahinSub = this.lahinService.getOne(this.id).subscribe({
        next: (lahin) => {
          this.modelDateTanggalLahin = {
            year: +lahin.tanggal.slice(0, 4),
            month: +lahin.tanggal.slice(5, 7),
            day: +lahin.tanggal.slice(8, 10)
          };

          this.lahinForm = new UntypedFormGroup({
            'nomor': new UntypedFormControl(lahin.nomor, [Validators.required, Validators.maxLength(255)]),
            'tanggal': new UntypedFormControl(this.modelDateTanggalLahin, [Validators.required, Validators.minLength(10)]),
            'pembuat': new UntypedFormControl(lahin.pembuat, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'perihal': new UntypedFormControl(lahin.perihal, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'lampiran': new UntypedFormControl(lahin.lampiran, Validators.maxLength(255)),
            'tindakLanjut': new UntypedFormControl(lahin.tindakLanjut),
            'keterangan': new UntypedFormControl(lahin.keterangan, Validators.maxLength(255)),
            'urlFile': new UntypedFormControl(lahin.urlFile)
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
    const dateDateTanggalLahin = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalLahin.year,
      this.modelDateTanggalLahin.month,
      this.modelDateTanggalLahin.day);

    const lahin = new RegisterLahin();
    lahin.nomor = this.lahinForm.value['nomor'];
    lahin.tanggal = dateDateTanggalLahin;
    lahin.pembuat = this.lahinForm.value['pembuat'];
    lahin.perihal = this.lahinForm.value['perihal'];
    lahin.lampiran = this.lahinForm.value['lampiran'];
    lahin.tindakLanjut = this.lahinForm.value['tindakLanjut'];
    lahin.keterangan = this.lahinForm.value['keterangan'];
    lahin.urlFile = this.lahinForm.value['urlFile'];

    if (this.isEditMode) {
      this.lahinSub = this.lahinService.update(lahin, this.id).subscribe({
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
      this.lahinSub = this.lahinService.create(lahin).subscribe({
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
          this.onCancel();
        }
      });
    }
  }

  onCancel() {
    this.lahinForm.reset();
    this.router.navigate(['/lahin', 'list'], { queryParams: { message: this.message } });
  }

  onDateTanggalSelect(date: NgbDate) {
    this.modelDateTanggalLahin = date;
  }

  onNotificationStatusChange(status: boolean) {
    this.notificationStatusService.changeNotificationStatus(status);
  }

  ngOnDestroy(): void {
    if (this.lahinFormSub) {
      this.lahinFormSub.unsubscribe();
    }
    if (this.lahinSub) {
      this.lahinSub.unsubscribe();
    }
    if (this.lahinParamSub) {
      this.lahinParamSub.unsubscribe();
    }
  }

}
