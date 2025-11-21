import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { Arsip } from '../arsip.model';
import { ArsipService } from '../arsip.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-arsip-form',
  templateUrl: './arsip-form.component.html',
  styleUrls: ['./arsip-form.component.css']
})
export class ArsipFormComponent implements OnInit, OnDestroy {
  arsipForm!: UntypedFormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private arsipFormSub!: Subscription;
  private arsipSub!: Subscription;
  private arsipParamSub!: Subscription;
  private id: string = null as any;
  jenisSurat: string = null as any;
  message: string = null as any;
  currentNotificationStatus: boolean = false;

  modelDateTanggalPenerimaanArsip: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalSurat: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(
    private arsipService: ArsipService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.modelDateTanggalPenerimaanArsip = this.calendar.getToday();
    this.modelDateTanggalSurat = this.calendar.getToday();
    this.arsipParamSub = this.route.params
      .subscribe((params: Params) => {
        this.isEditMode = params['id'] != null;
        this.id = params['id'];
      });
    this.initForm();
    this.arsipFormSub = this.arsipForm.statusChanges.subscribe(
      // (status) => console.log(status)
    );
    this.notificationStatusService.currentNotificationStatus.subscribe(notification => this.currentNotificationStatus = notification);
  }

  initForm() {
    let jamPenerimaanArsip = this.currentDateTimeService.getCurrentTime();

    this.arsipForm = new UntypedFormGroup({
      'tanggalPenerimaanArsip': new UntypedFormControl(this.modelDateTanggalPenerimaanArsip, [Validators.required, Validators.minLength(10)]),
      'jamPenerimaanArsip': new UntypedFormControl(jamPenerimaanArsip, [Validators.required, Validators.minLength(5)]),
      'diterimaDari': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'nomorSurat': new UntypedFormControl(null as any, [Validators.required, Validators.maxLength(255)]),
      'tanggalSurat': new UntypedFormControl(this.modelDateTanggalSurat, [Validators.required, Validators.minLength(10)]),
      'perihal': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'lampiran': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'kodePenyimpanan': new UntypedFormControl(null as any, [Validators.required, Validators.maxLength(255)]),
      'keterangan': new UntypedFormControl(null as any, Validators.maxLength(255)),
      'urlFile': new UntypedFormControl(null as any)
    });

    if (this.isEditMode) {
      this.isLoadingEditForm = true;
      this.arsipSub = this.arsipService.getOne(this.id).subscribe({
        next: (arsip) => {
          this.modelDateTanggalPenerimaanArsip = {
            year: +arsip.tanggalPenerimaanArsip.slice(0, 4),
            month: +arsip.tanggalPenerimaanArsip.slice(5, 7),
            day: +arsip.tanggalPenerimaanArsip.slice(8, 10)
          };
          this.modelDateTanggalSurat = {
            year: +arsip.tanggalSurat.slice(0, 4),
            month: +arsip.tanggalSurat.slice(5, 7),
            day: +arsip.tanggalSurat.slice(8, 10)
          };

          this.arsipForm = new UntypedFormGroup({
            'tanggalPenerimaanArsip': new UntypedFormControl(this.modelDateTanggalPenerimaanArsip, [Validators.required, Validators.minLength(10)]),
            'jamPenerimaanArsip': new UntypedFormControl(arsip.jamPenerimaanArsip, [Validators.required, Validators.minLength(5)]),
            'diterimaDari': new UntypedFormControl(arsip.diterimaDari, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'nomorSurat': new UntypedFormControl(arsip.nomorSurat, [Validators.required, Validators.maxLength(255)]),
            'tanggalSurat': new UntypedFormControl(this.modelDateTanggalSurat, [Validators.required, Validators.minLength(10)]),
            'perihal': new UntypedFormControl(arsip.perihal, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'lampiran': new UntypedFormControl(arsip.lampiran, Validators.maxLength(255)),
            'kodePenyimpanan': new UntypedFormControl(arsip.kodePenyimpanan, Validators.maxLength(255)),
            'keterangan': new UntypedFormControl(arsip.keterangan, Validators.maxLength(255)),
            'urlFile': new UntypedFormControl(arsip.urlFile)
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
    const dateTanggalPenerimaanArsip = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalPenerimaanArsip.year,
      this.modelDateTanggalPenerimaanArsip.month,
      this.modelDateTanggalPenerimaanArsip.day);
    const dateTanggalSurat = this.currentDateTimeService.getConvertCurrentDate(
      this.modelDateTanggalSurat.year,
      this.modelDateTanggalSurat.month,
      this.modelDateTanggalSurat.day);

    const arsip = new Arsip();
    arsip.tanggalPenerimaanArsip = dateTanggalPenerimaanArsip;
    arsip.jamPenerimaanArsip = this.arsipForm.value['jamPenerimaanArsip'];
    arsip.diterimaDari = this.arsipForm.value['diterimaDari'];
    arsip.nomorSurat = this.arsipForm.value['nomorSurat'];
    arsip.tanggalSurat = dateTanggalSurat;
    arsip.perihal = this.arsipForm.value['perihal'];
    arsip.lampiran = this.arsipForm.value['lampiran'];
    arsip.kodePenyimpanan = this.arsipForm.value['kodePenyimpanan'];
    arsip.keterangan = this.arsipForm.value['keterangan'];
    arsip.urlFile = this.arsipForm.value['urlFile'];

    if (this.isEditMode) {
      this.arsipSub = this.arsipService.update(arsip, this.id).subscribe({
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
      this.arsipSub = this.arsipService.create(arsip).subscribe({
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

  onCancel() {
    this.arsipForm.reset();
    this.router.navigate(['/arsip', 'list'], { queryParams: { message: this.message } });
  }

  onDateTanggalSuratSelect(date: NgbDate) {
    this.modelDateTanggalSurat = date;
  }

  onDateTanggalPenerimaanSelect(date: NgbDate) {
    this.modelDateTanggalPenerimaanArsip = date;
  }

  onNotificationStatusChange(status: boolean){
    this.notificationStatusService.changeNotificationStatus(status);
  }

  ngOnDestroy(): void {
    if (this.arsipFormSub) {
      this.arsipFormSub.unsubscribe();
    }
    if (this.arsipSub) {
      this.arsipSub.unsubscribe();
    }
    if (this.arsipParamSub) {
      this.arsipParamSub.unsubscribe();
    }
  }

}
