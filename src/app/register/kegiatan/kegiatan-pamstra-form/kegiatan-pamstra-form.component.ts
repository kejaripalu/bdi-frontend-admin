import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Sektor } from 'src/app/shared/bidang-direktorat/sektor';
import { RegisterKegiatanIntelijenPamstraService } from '../kegiatan-pamstra.service';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { RegisterKegiatanIntelijenPamstra } from '../kegiatan-pamstra.model';

@Component({
  selector: 'app-kegiatan-pamstra-form',
  templateUrl: './kegiatan-pamstra-form.component.html',
  styleUrls: ['./kegiatan-pamstra-form.component.css']
})
export class KegiatanPamstraFormComponent implements OnInit, OnDestroy {
  giatForm!: FormGroup;
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

  modelDateTanggalSuratPermohonan: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalSprintWalpam: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalPemaparan: NgbDateStruct = null as any; // model date NgBootstrap
  modelDateTanggalKertasKerja: NgbDateStruct = null as any; // model date NgBootstrap

  constructor(private giatService: RegisterKegiatanIntelijenPamstraService,
              private bidangDirektoratSektorService: BidangDirektoratSektorService,
              private route: ActivatedRoute, 
              private router: Router,
              private calendar: NgbCalendar, // service calendar NgBootStrap
              private currentDateTimeService: CurrentDateTimeService) { }

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
  }

  private initForm() {
    let namaKegiatan = null as any;
    let sumberDana = null as any;
    let instansi = null as any;
    let paguAnggaran = null as any;
    let nomorSuratPermohonan = null as any;
    let tempatPemaparan = null as any;
    let telaahanIntelijen = null as any;
    let tindakLanjut = this.tindakLanjutValue;
    let tindakLanjutKeterangan = null as any;
    let nomorSprintWalpam = null as any;
    let namaPetugasPelaksana = null as any;
    let nilaiKontrak = null as any;
    let hasilPelaksanaan = this.pelaksanaanSelected;
    let hasilPelaksanaanKeterangan = null as any;
    let nomorKertasKerja = null as any;
    let keterangan = null as any;
    let urlFile = null as any;

    this.giatForm = new FormGroup({
      'namaKegiatan': new FormControl(namaKegiatan, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'sumberDana': new FormControl(sumberDana, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'instansi': new FormControl(instansi, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'paguAnggaran': new FormControl(paguAnggaran, [Validators.required]),
      'nomorSuratPermohonan': new FormControl(nomorSuratPermohonan, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
      'tanggalSuratPermohonan': new FormControl(this.modelDateTanggalSuratPermohonan, [Validators.required, Validators.minLength(10)]),
      'tempatPemaparan': new FormControl(tempatPemaparan, [Validators.maxLength(255)]),
      'tanggalPemaparan': new FormControl(this.modelDateTanggalPemaparan, [Validators.minLength(10)]),
      'telaahanIntelijen': new FormControl(telaahanIntelijen),
      'tindakLanjut': new FormControl(tindakLanjut),
      'tindakLanjutKeterangan': new FormControl(tindakLanjutKeterangan),
      'nomorSprintWalpam': new FormControl(nomorSprintWalpam, [Validators.maxLength(255)]),
      'tanggalSprintWalpam': new FormControl(this.modelDateTanggalSprintWalpam, [Validators.minLength(10)]),
      'namaPetugasPelaksana': new FormControl(namaPetugasPelaksana, [Validators.maxLength(255)]),
      'nilaiKontrak': new FormControl(nilaiKontrak),
      'hasilPelaksanaan': new FormControl(hasilPelaksanaan),
      'hasilPelaksanaanKeterangan': new FormControl(hasilPelaksanaanKeterangan),
      'nomorKertasKerja': new FormControl(nomorKertasKerja, [Validators.maxLength(255)]),
      'tanggalKertasKerja': new FormControl(this.modelDateTanggalKertasKerja, [Validators.minLength(10)]),
      'keterangan': new FormControl(keterangan, Validators.maxLength(255)),
      'urlFile': new FormControl(urlFile)
    });

    for (let i = 41; i < 61; i++) {        
      this.sektorList.push(
        { deskripsiSektor: this.bidangDirektoratSektorService.getSektor()[i].deskripsiSektor!,
          namaSektor: this.bidangDirektoratSektorService.getSektor()[i].namaSektor!
        });
    }
    this.namaSektorSelected = this.sektorList[0].namaSektor!;

    if (this.isEditMode) {
      this.isLoadingEditForm = true;
      this.giatSub = this.giatService.getOne(this.id).subscribe({
        next: (giat) => {
          this.modelDateTanggalSuratPermohonan = {year: +giat.tanggalSuratPermohonan.slice(0, 4), 
            month: +giat.tanggalSuratPermohonan.slice(5, 7), 
            day: +giat.tanggalSuratPermohonan.slice(8, 10)};      
          this.modelDateTanggalSprintWalpam = {year: +giat.tanggalSprintWalpam.slice(0, 4), 
            month: +giat.tanggalSprintWalpam.slice(5, 7), 
            day: +giat.tanggalSprintWalpam.slice(8, 10)};      
          this.modelDateTanggalKertasKerja = {year: +giat.tanggalKertasKerja.slice(0, 4), 
            month: +giat.tanggalKertasKerja.slice(5, 7), 
            day: +giat.tanggalKertasKerja.slice(8, 10)};      
          this.modelDateTanggalPemaparan = {year: +giat.tanggalPemaparan.slice(0, 4), 
            month: +giat.tanggalPemaparan.slice(5, 7), 
            day: +giat.tanggalPemaparan.slice(8, 10)};      
          
          this.giatForm = new FormGroup({
            'namaKegiatan': new FormControl(giat.namaKegiatan, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
            'sumberDana': new FormControl(giat.sumberDana, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'instansi': new FormControl(giat.instansi, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'paguAnggaran': new FormControl(giat.paguAnggaran, [Validators.required]),
            'nomorSuratPermohonan': new FormControl(giat.nomorSuratPermohonan, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            'tanggalSuratPermohonan': new FormControl(this.modelDateTanggalSuratPermohonan, [Validators.required, Validators.minLength(10)]),
            'tempatPemaparan': new FormControl(giat.tempatPemaparan, [Validators.maxLength(255)]),
            'tanggalPemaparan': new FormControl(this.modelDateTanggalPemaparan, [Validators.minLength(10)]),
            'telaahanIntelijen': new FormControl(giat.telaahanIntelijen),
            'tindakLanjut': new FormControl(giat.tindakLanjut),
            'tindakLanjutKeterangan': new FormControl(giat.tindakLanjutKeterangan),
            'nomorSprintWalpam': new FormControl(giat.nomorSprintWalpam, [Validators.maxLength(255)]),
            'tanggalSprintWalpam': new FormControl(this.modelDateTanggalSprintWalpam, [Validators.minLength(10)]),
            'namaPetugasPelaksana': new FormControl(giat.namaPetugasPelaksana, [Validators.minLength(3)]),
            'nilaiKontrak': new FormControl(giat.nilaiKontrak),
            'hasilPelaksanaan': new FormControl(giat.hasilPelaksanaan),
            'hasilPelaksanaanKeterangan': new FormControl(giat.hasilPelaksanaanKeterangan),
            'nomorKertasKerja': new FormControl(giat.nomorKertasKerja, [Validators.maxLength(255)]),
            'tanggalKertasKerja': new FormControl(this.modelDateTanggalKertasKerja, [Validators.minLength(10)]),
            'keterangan': new FormControl(giat.keterangan, Validators.maxLength(255)),
            'urlFile': new FormControl(giat.urlFile)
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
      giat.tanggalPemaparan = dateTanggalSuratPermohonan;
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
      giat.id = this.id;

      this.giatSub = this.giatService.update(giat).subscribe({
        next: () => {
          this.isLoading = false;
          this.message = 'UpdateSukses';
          this.onCancel();
        },
        error: (errorMessage) => {
          this.error = errorMessage;
          this.isLoading = false;
        }
      });
    } else {
      this.giatSub = this.giatService.create(giat).subscribe({
        next: () => {
          // console.log(responseData);
          this.isLoading = false;
          this.message = 'SimpanSukses';
          this.onCancel();
        },
        error: (errorMessage) => {
          this.error = errorMessage;
          this.isLoading = false;
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
