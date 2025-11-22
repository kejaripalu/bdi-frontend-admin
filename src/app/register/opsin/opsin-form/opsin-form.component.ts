import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Sektor } from 'src/app/shared/bidang-direktorat/sektor';
import { RegisterOpsinService } from '../opsin.service';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { RegisterOpsin } from '../opsin.model';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
    selector: 'app-opsin-form',
    templateUrl: './opsin-form.component.html',
    styleUrls: ['./opsin-form.component.css'],
    standalone: false
})
export class OpsinFormComponent implements OnInit, OnDestroy {
  opsinForm!: UntypedFormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private opsinFormSub!: Subscription;
  private opsinSub!: Subscription;
  private opsinParamSub!: Subscription;
  private opsinQueryParamSub!: Subscription;
  private id: string = null as any;
  namaBidang: string = null as any;
  indexBidang!: number;
  message: string = null as any;
  sektorList: Sektor[] = [];
  namaSektorSelected: string = null as any;
  currentNotificationStatus: boolean = false;

  modelDateTanggal: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(
    private opsinService: RegisterOpsinService,
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
    this.opsinParamSub = this.route.params
      .subscribe((params: Params) => {
        this.isEditMode = params['id'] != null;
        this.id = params['id'];
      });
    this.opsinQueryParamSub = this.route.queryParams
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
    this.opsinFormSub = this.opsinForm.statusChanges.subscribe(
      // (status) => console.log(status)
    );
    this.notificationStatusService.currentNotificationStatus.subscribe(notification => this.currentNotificationStatus = notification);
  }

  private initForm() {

    this.opsinForm = new UntypedFormGroup({
      'nomor': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'tanggal': new UntypedFormControl(this.modelDateTanggal, [Validators.required, Validators.minLength(10)]),
      'perihal': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]),
      'namaPetugasPelaksana': new UntypedFormControl(null as any, [Validators.required, Validators.minLength(3)]),
      'hasilPelaksanaanOperasi': new UntypedFormControl(null as any),
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
      this.opsinSub = this.opsinService.getOne(this.id).subscribe({
        next: (opsin) => {
          this.modelDateTanggal = {
            year: +opsin.tanggal.slice(0, 4),
            month: +opsin.tanggal.slice(5, 7),
            day: +opsin.tanggal.slice(8, 10)
          };

          this.opsinForm = new UntypedFormGroup({
            'nomor': new UntypedFormControl(opsin.nomor, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'tanggal': new UntypedFormControl(this.modelDateTanggal, [Validators.required, Validators.minLength(10)]),
            'perihal': new UntypedFormControl(opsin.perihal, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]),
            'namaPetugasPelaksana': new UntypedFormControl(opsin.namaPetugasPelaksana, [Validators.required, Validators.minLength(3)]),
            'hasilPelaksanaanOperasi': new UntypedFormControl(opsin.hasilPelaksanaanOperasi),
            'keterangan': new UntypedFormControl(opsin.keterangan, Validators.maxLength(255)),
            'urlFile': new UntypedFormControl(opsin.urlFile)
          });

          this.namaSektorSelected = opsin.sektor;
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

    const opsin = new RegisterOpsin();
    opsin.bidangDirektorat = this.namaBidang;
    opsin.sektor = this.namaSektorSelected;
    opsin.nomor = this.opsinForm.value['nomor'];
    opsin.tanggal = dateTanggal;
    opsin.perihal = this.opsinForm.value['perihal'];
    opsin.namaPetugasPelaksana = this.opsinForm.value['namaPetugasPelaksana'];
    opsin.hasilPelaksanaanOperasi = this.opsinForm.value['hasilPelaksanaanOperasi'];
    opsin.keterangan = this.opsinForm.value['keterangan'];
    opsin.urlFile = this.opsinForm.value['urlFile'];

    if (this.isEditMode) {
      this.opsinSub = this.opsinService.update(opsin, this.id).subscribe({
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
      this.opsinSub = this.opsinService.create(opsin).subscribe({
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
    this.opsinForm.reset();
    this.router.navigate(['/opsin', 'list'], {
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
    if (this.opsinFormSub) {
      this.opsinFormSub.unsubscribe();
    }
    if (this.opsinSub) {
      this.opsinSub.unsubscribe();
    }
    if (this.opsinParamSub) {
      this.opsinParamSub.unsubscribe();
    }
    if (this.opsinQueryParamSub) {
      this.opsinQueryParamSub.unsubscribe();
    }
  }

}
