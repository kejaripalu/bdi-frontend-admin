import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first, map, Subscription } from 'rxjs';
import { DataPetaService } from '../data-peta.service';
import { BidangDirektoratSektorPetaService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor-peta.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { latitudeRangeValidator, longitudeRangeValidator } from 'src/app/shared/coordinate.validator';
import { DataPeta } from '../data-peta.model';
import * as L from 'leaflet';
import { error, log } from 'console';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-data-peta-form',
    templateUrl: './data-peta-form.component.html',
    styleUrls: ['./data-peta-form.component.css'],
    standalone: false
})
export class DataPetaFormComponent implements OnInit, OnDestroy, AfterViewInit {
  
  petaForm!: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private petaFormSub!: Subscription;
  private petaSub!: Subscription;
  private petaParamSub!: Subscription;
  private petaQueryParamSub!: Subscription;
  private id: string = null as any;
  namaBidang: string = null as any;
  title: string = null as any;
  indexBidang!: number;
  message: string = null as any;
  sektorList: any[] = [];
  namaSektorSelected: string = null as any;
  deskripsiSektorSelected: string = null as any;
  currentNotificationStatus: boolean = false;
  date: NgbDateStruct = null as any;

  // Maps
  private map!: L.Map;
  private marker?: L.Marker; // Variabel untuk menyimpan penanda saat ini
  public clickedLat: number | null = null as any;
  public clickedLon: number | null = null as any;
  public addressDetails: string = 'Mencari alamat...'; // <-- Variabel untuk menampung alamat

  constructor(
    private petaService: DataPetaService,
    private sektorPetaService: BidangDirektoratSektorPetaService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient
  ) { }
  
  ngAfterViewInit(): void {
    this.initMap();

    // Tambahkan marker awal dan update pop-up setelah data alamat awal dimuat
    this.addMarker([ this.clickedLat!, this.clickedLon! ]);
    
    // Update pop-up dengan alamat yang sudah di-fetch
    // Timeout diperlukan untuk memastikan DOM marker sudah ada saat pop-up diupdate
    setTimeout(() => {
        this.updateMarkerPopup(this.addressDetails, this.clickedLat!, this.clickedLon!);
    }, 100);
  }
  
  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.date = this.calendar.getToday();
    this.petaParamSub = this.route.params
    .subscribe((params: Params) => {
      this.isEditMode = params['id'] != null;
      this.id = params['id'];
    });

    this.petaQueryParamSub = this.route.queryParams
          .subscribe((queryParams: Params) => {
            this.indexBidang = this.sektorPetaService.getBidangDirektori()
              .findIndex(bidang => {
                return bidang.namaBidang === queryParams['bidang'];
              });
            // if index not found set to index 0 (IPOLHANKAM)
            if (this.indexBidang < 0) {
              this.indexBidang = 0;
            }
            this.title = this.sektorPetaService.getBidangDirektori()[this.indexBidang].deskripsiBidang!;
            this.namaBidang = this.sektorPetaService.getBidangDirektori()[this.indexBidang].namaBidang!;    
    });
    this.initForm();
    this.petaFormSub = this.petaForm.statusChanges.subscribe();
    this.notificationStatusService.currentNotificationStatus.subscribe(status => {
      this.currentNotificationStatus = status;
    });

    // inisialisasi koordinat awal
    this.clickedLat = -0.8970856;
    this.clickedLon = 119.8663171;
    this.getAddress(this.clickedLat!, this.clickedLon!).subscribe({
      next: (address) => {
        this.addressDetails = address;
      }, error: () => {
        this.addressDetails = 'Gagal memuat alamat.';
      }
    });
  }

  private initForm() {
     this.petaForm = new FormGroup({
      'tanggal': new FormControl(this.date, [Validators.required, Validators.minLength(10)]),
      'lokasi': new FormControl(null as any, [Validators.required, Validators.minLength(5)]),
      'latitude': new FormControl(null as any, [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), latitudeRangeValidator()]),
      'longitude': new FormControl(null as any, [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), longitudeRangeValidator()]),
      'siapa': new FormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'apa': new FormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'mengapa': new FormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'bagaimana': new FormControl(null as any, [Validators.required, Validators.minLength(10)]),
      'keterangan': new FormControl(null as any, Validators.maxLength(255))
    });

      switch (this.namaBidang) {
        case 'IPOLHANKAM':
          for (let i = 0; i < 12; i++) {
            this.sektorList.push({
              deskripsiSektor: this.sektorPetaService.getSektor()[i].deskripsiSektor!,
              namaSektor: this.sektorPetaService.getSektor()[i].namaSektor!
            });
          }
          this.namaSektorSelected = this.sektorList[0].namaSektor!;
          this.deskripsiSektorSelected = this.sektorList[0].deskripsiSektor!;
          break;
        case 'SOSBUDMAS':
          for (let i = 12; i < 24; i++) {
            this.sektorList.push({
              deskripsiSektor: this.sektorPetaService.getSektor()[i].deskripsiSektor!,
              namaSektor: this.sektorPetaService.getSektor()[i].namaSektor!
            });
          }
          this.namaSektorSelected = this.sektorList[0].namaSektor!;
          this.deskripsiSektorSelected = this.sektorList[0].deskripsiSektor!;
          break;
        case 'EKOKEU':
          for (let i = 24; i < 40; i++) {
            this.sektorList.push({
              deskripsiSektor: this.sektorPetaService.getSektor()[i].deskripsiSektor!,
              namaSektor: this.sektorPetaService.getSektor()[i].namaSektor!
            });
          }
          this.namaSektorSelected = this.sektorList[0].namaSektor!;
          this.deskripsiSektorSelected = this.sektorList[0].deskripsiSektor!;
          break;
        case 'PAMSTRA':
          for (let i = 40; i < 60; i++) {
            this.sektorList.push({
              deskripsiSektor: this.sektorPetaService.getSektor()[i].deskripsiSektor!,
              namaSektor: this.sektorPetaService.getSektor()[i].namaSektor!
            });
          }
          this.namaSektorSelected = this.sektorList[0].namaSektor!;
          this.deskripsiSektorSelected = this.sektorList[0].deskripsiSektor!;
          break;
        case 'TIPRODIN':
          for (let i = 60; i < 74; i++) {
            this.sektorList.push({
              deskripsiSektor: this.sektorPetaService.getSektor()[i].deskripsiSektor!,
              namaSektor: this.sektorPetaService.getSektor()[i].namaSektor!
            });
          }
          this.namaSektorSelected = this.sektorList[0].namaSektor!;
          this.deskripsiSektorSelected = this.sektorList[0].deskripsiSektor!;
          break;
        default: {
          for (let i = 0; i < 12; i++) {
            this.sektorList.push({
              deskripsiSektor: this.sektorPetaService.getSektor()[i].deskripsiSektor!,
              namaSektor: this.sektorPetaService.getSektor()[i].namaSektor!
            });
          }
          this.namaSektorSelected = this.sektorList[0].namaSektor!;
          this.deskripsiSektorSelected = this.sektorList[0].deskripsiSektor!;
        };
      }

      if (this.isEditMode) {
        this.isLoadingEditForm = true;
        this.petaSub = this.petaService.getOne(this.id).subscribe({
          next: (peta) => {
            this.date = {
              year: +peta.tanggal.slice(0, 4),
              month: +peta.tanggal.slice(5, 7),
              day: +peta.tanggal.slice(8, 10)
            };

            this.petaForm = new FormGroup({
              'tanggal': new FormControl(this.date, [Validators.required, Validators.minLength(10)]),
              'lokasi': new FormControl(peta.lokasi, [Validators.required, Validators.minLength(5)]),
              'latitude': new FormControl(peta.latitude, [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), latitudeRangeValidator()]),
              'longitude': new FormControl(peta.longitude, [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), longitudeRangeValidator()]),
              'siapa': new FormControl(peta.siapa, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
              'apa': new FormControl(peta.apa, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
              'mengapa': new FormControl(peta.mengapa, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
              'bagaimana': new FormControl(peta.bagaimana, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]),
              'keterangan': new FormControl(peta.keterangan, Validators.maxLength(255))
            });

            this.namaSektorSelected = peta.sektor!;
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
    const theDate = this.currentDateTimeService.getConvertCurrentDate(
      this.date.year, this.date.month, this.date.day
    );

    const dataPeta = new DataPeta();
    dataPeta.tanggal = theDate;
    dataPeta.lokasi = this.petaForm.value.lokasi;
    dataPeta.latitude = this.petaForm.value.latitude;
    dataPeta.longitude = this.petaForm.value.longitude;
    dataPeta.siapa = this.petaForm.value.siapa;
    dataPeta.apa = this.petaForm.value.apa;
    dataPeta.mengapa = this.petaForm.value.mengapa;
    dataPeta.bagaimana = this.petaForm.value.bagaimana;
    dataPeta.keterangan = this.petaForm.value.keterangan;
    dataPeta.bidangDirektorat = this.namaBidang;
    dataPeta.sektor = this.namaSektorSelected;

    if (this.isEditMode) {
      this.petaSub = this.petaService.update(this.id, dataPeta).subscribe({
        next: () => {
          this.isLoading = false;
          this.message = 'UpdateSukses';
          this.onNotificationStatusChange(true);
          this.onCancel();
        },
        error: (errorMessage) => {
          this.isLoading = false;
          this.error = errorMessage;
          this.onNotificationStatusChange(false);
        }
      });
    } else {
      this.petaSub = this.petaService.create(dataPeta).subscribe({
        next: () => {
          this.isLoading = false;
          this.message = 'SimpanSukses';
          this.onNotificationStatusChange(true);
          this.onCancel();
        },
        error: (errorMessage) => {
          this.isLoading = false;
          this.error = errorMessage;
          this.onNotificationStatusChange(false);
        }
      });
    }
  }

  initMap(): void {
    // 1. Inisialisasi peta dan atur koordinat tengah serta level zoom awal
    // Pastikan clickedLat/clickedLon tidak null dengan fallback default
    this.map = L.map('map').setView([this.clickedLat ?? -0.8970856, this.clickedLon ?? 119.8663171], 13);

    // 2. Tambahkan Tile Layer (dari OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // Penting: Sertakan atribusi sesuai kebijakan OpenStreetMap
      attribution: '© OpenStreetMap contributors' 
    }).addTo(this.map);

    // inisialisasi marker awal
    this.addMarker([this.clickedLat ?? -0.8970856, this.clickedLon ?? 119.8663171]);

    // 3. Tambahkan Event Listener untuk Klik Peta
    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
  }

  private addMarker(coords: [number, number]): void {
    // Hapus marker lama jika ada
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Buat marker baru
    this.marker = L.marker(coords).addTo(this.map);
    this.marker.bindPopup(`Lat: ${coords[0].toFixed(6)}, Lon: ${coords[1].toFixed(6)}`).openPopup();
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    console.log("onMapClick dipicu!");

    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    // 🔑 KUNCI: Bungkus modifikasi state di dalam ngZone.run()
    this.ngZone.run(() => {
      // A. Update Waypoint/Marker
      this.addMarker([lat, lon]);

      // B. Simpan dan Tampilkan Lat/Lon yang Diklik
      this.clickedLat = lat;
      this.clickedLon = lon;
      this.addressDetails = 'Mencari alamat...'; // Reset status alamat

      // Panggil fungsi untuk mendapatkan alamat dari koordinat
      this.getAddress(lat, lon).subscribe({
        next: (address) => {
          if (address) {
            this.addressDetails = address;
            // update pop-up marker di sini
            this.updateMarkerPopup(address, lat, lon);            
          } else {
            this.addressDetails = 'Alamat tidak ditemukan.';
          }
          // Pastikan perubahan terdeteksi oleh Angular setelah update async
          try { this.changeDetector.detectChanges(); } catch (e) { /* ignore */ }
        }, error: () => {
          this.addressDetails = 'Gagal memuat alamat.';
          // Pastikan perubahan terdeteksi oleh Angular setelah update async
          try { this.changeDetector.detectChanges(); } catch (e) { /* ignore */ }
        }
      });

     console.log(`Peta diklik pada: Lat ${lat.toFixed(6)}, Lon ${lon.toFixed(6)}`);
    });
  }

  getAddress(lat: number, lon: number) {
      // API Nominatim untuk Reverse Geocoding
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

      return this.http.get<any>(url).pipe(
      first(), // Pastikan Observable selesai setelah nilai pertama diterima
      map(data => {
        if (data && data.display_name) {
          // update pop-up marker di sini
          this.updateMarkerPopup(data.display_name, lat, lon);    
          return data.display_name;
        }
        return 'Alamat tidak ditemukan.';
      })
    );
  }

  updateMarkerPopup(address: string, lat: number, lon: number): void {
      if (this.marker) {
          // Format koordinat
          const latText = lat.toFixed(6);
          const lonText = lon.toFixed(6);

          // Pop-up
          const popupContent = `
              <b>Lokasi Dipilih</b>
              <hr style="margin: 5px 0;">
              <strong>Lat:</strong> ${latText}, <strong>Lon:</strong> ${lonText}<br>
              <hr style="margin: 5px 0;">
              <strong>Alamat:</strong> ${address}
          `;
          this.marker.setPopupContent(popupContent).openPopup();
          console.log(`Alamat: ${address}`);
      }
  }

  onDateSelect(date: NgbDate) {
    this.date = date;
  }

  onSektorChange(selectedSektor: string) {
    this.namaSektorSelected = selectedSektor
  }

  onCancel() {
    this.petaForm.reset();
    this.router.navigate(['/data-peta', 'list'], {
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
    if (this.petaFormSub) {
      this.petaFormSub.unsubscribe();
    }
    if (this.petaSub) {
      this.petaSub.unsubscribe();
    }
    if (this.petaParamSub) {
      this.petaParamSub.unsubscribe();
    }
    if (this.petaQueryParamSub) {
      this.petaQueryParamSub.unsubscribe();
    }
  }  
}
