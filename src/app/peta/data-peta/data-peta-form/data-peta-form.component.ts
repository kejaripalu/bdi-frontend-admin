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
  public clickedLon: number | null = null as any;
  public addressDetails: string = 'Mencari alamat...'; // <-- Variabel untuk menampung alamat
  public clickedLat: number | null = null as any;
  // Guard untuk menghindari pemrosesan klik ganda yang cepat
  private _lastMapClick = 0;
  // Retry attempts to initialize map when element isn't yet in DOM
  private _initMapAttempts = 0;

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
  }
  
  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.date = this.calendar.getToday();
    // determine edit mode early from snapshot so we can skip initial map init when editing
    this.isEditMode = this.route.snapshot.params['id'] != null;
    this.id = this.route.snapshot.params['id'];
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

    // inisialisasi koordinat awal pada maps hanya jika bukan edit mode
    if (!this.isEditMode) {
      this.clickedLat = -0.8970856;
      this.clickedLon = 119.8663171;
      this.getAddress(this.clickedLat!, this.clickedLon!).subscribe({
        next: (address) => {
          this.addressDetails = address;
          // update initial form values so form shows address/coords on load
          try {
            if (this.petaForm) {
              this.petaForm.patchValue({
                lokasi: this.addressDetails,
                latitude: this.clickedLat,
                longitude: this.clickedLon
              });
            }
          } catch (e) { /* ignore */ }
        }, error: () => {
          this.addressDetails = 'Gagal memuat alamat.';
        }
      });
    }
  }

  private initForm() {
     this.petaForm = new FormGroup({
      'tanggal': new FormControl(this.date, [Validators.required, Validators.minLength(10)]),
      'lokasi': new FormControl(null as any, [Validators.required, Validators.minLength(5)]),
      'latitude': new FormControl(null as any, [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), latitudeRangeValidator()]),
      'longitude': new FormControl(null as any, [Validators.required, Validators.pattern(/^-?\d*\.?\d*$/), longitudeRangeValidator()]),
      'siapa': new FormControl(null as any, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),
      'apa': new FormControl(null as any, [Validators.required, Validators.minLength(5)]),
      'mengapa': new FormControl(null as any, [Validators.required, Validators.minLength(5)]),
      'bagaimana': new FormControl(null as any, [Validators.required, Validators.minLength(10)]),
      'keterangan': new FormControl(null as any, Validators.maxLength(255))
    });

    this.loadSektorData();

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
              'apa': new FormControl(peta.apa, [Validators.required, Validators.minLength(5)]),
              'mengapa': new FormControl(peta.mengapa, [Validators.required, Validators.minLength(5)]),
              'bagaimana': new FormControl(peta.bagaimana, [Validators.required, Validators.minLength(10)]),
              'keterangan': new FormControl(peta.keterangan, Validators.maxLength(255))
            });

            this.namaSektorSelected = peta.sektor!;
            // Use coordinates/address from the loaded peta to populate map and form
            try {
              if (peta.latitude != null && peta.longitude != null) {
                this.clickedLat = +peta.latitude;
                this.clickedLon = +peta.longitude;
              }

              // Prefer stored lokasi in peta, otherwise try reverse-geocoding
              if (peta.lokasi) {
                this.addressDetails = peta.lokasi;
              } else if (this.clickedLat != null && this.clickedLon != null) {
                this.getAddress(this.clickedLat, this.clickedLon).subscribe({
                  next: (addr) => { this.addressDetails = addr; },
                  error: () => { /* ignore */ }
                });
              }

              // Patch form values if necessary (ensure template shows coords)
              if (this.petaForm) {
                this.petaForm.patchValue({
                  lokasi: this.addressDetails || peta.lokasi,
                  latitude: this.clickedLat,
                  longitude: this.clickedLon
                });
              }

              // If map already initialized, update view and marker
              if (this.map) {
                try {
                  this.map.setView([this.clickedLat ?? -0.8970856, this.clickedLon ?? 119.8663171], 13);
                  this.addMarker([this.clickedLat ?? -0.8970856, this.clickedLon ?? 119.8663171]);
                  if (this.addressDetails) {
                    this.updateMarkerPopup(this.addressDetails, this.clickedLat ?? -0.8970856, this.clickedLon ?? 119.8663171);
                  }
                } catch (e) { /* ignore */ }
              }
            } catch (e) { /* ignore */ }
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
  
  loadSektorData() {
    this.sektorList = [];
    let startIndex: number = 0;
    let endIndex: number = 0;

    switch (this.namaBidang) {
      case 'IPOLHANKAM':
        startIndex = 0;
        endIndex = 12;          
        break;
      case 'SOSBUDMAS':
        startIndex = 12;
        endIndex = 24;          
        break;
      case 'EKOKEU':
        startIndex = 24;
        endIndex = 40;          
        break;
      case 'PAMSTRA':
        startIndex = 40;
        endIndex = 60;          
        break;
      case 'TIPRODIN':
        startIndex = 60;
        endIndex = 74;          
        break;
      default: {
        startIndex = 0;
        endIndex = 12;
      };
    }
    
    const sektorArray = this.sektorPetaService.getSektor();
    const selectedSektor = sektorArray.slice(startIndex, endIndex);
    this.sektorList = selectedSektor.map(sektor => ({
      deskripsiSektor: sektor.deskripsiSektor!,
      namaSektor: sektor.namaSektor!
    }));
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
    // Prevent double initialization
    if (this.map) {
      try {
        this.map.setView([this.clickedLat ?? -0.8970856, this.clickedLon ?? 119.8663171], 13);
        this.addMarker([this.clickedLat ?? -0.8970856, this.clickedLon ?? 119.8663171]);
      } catch (e) { /* ignore errors */ }
      return;
    }

    // Ensure the map container element exists and is visible. If not, retry a few times.
    const mapEl = document.getElementById('map');
    if (!mapEl || (mapEl.clientWidth === 0 && mapEl.clientHeight === 0)) {
      if (this._initMapAttempts < 10) {
        this._initMapAttempts++;
        setTimeout(() => this.initMap(), 100);
      } else {
        console.warn('Map element not found or not visible after multiple attempts. Aborting init.');
      }
      return;
    }

    // reset attempts counter when element found
    this._initMapAttempts = 0;

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
    // Pastikan handler klik tidak terdaftar lebih dari sekali
    try {
      this.map.off('click');
    } catch (e) { /* ignore if none */ }
    this.map.on('click', (e: L.LeafletMouseEvent) => this.onMapClick(e));
  }

  private addMarker(coords: [number, number]): void {
    // If map not initialized yet, skip — initMap will add marker when ready
    if (!this.map) {
      console.warn('addMarker called but map is not initialized yet');
      return;
    }

    // Hapus marker lama jika ada
    if (this.marker) {
      try {
        this.map.removeLayer(this.marker);
      } catch (e) { /* ignore remove errors */ }
    }

    // Buat marker baru
    this.marker = L.marker(coords).addTo(this.map);
    try {
      this.marker.bindPopup(`Lat: ${coords[0].toFixed(6)}, Lon: ${coords[1].toFixed(6)}`).openPopup();
    } catch (e) { /* ignore popup errors */ }
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const now = Date.now();
    if (now - this._lastMapClick < 250) {
      return; // abaikan klik ganda cepat
    }
    this._lastMapClick = now;

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
            // update reactive form controls dan juga properti bound ke template
            try {
              // update properties used by [(ngModel)] in template
              this.clickedLat = lat;
              this.clickedLon = lon;

              // patch reactive form
              if (this.petaForm) {
                this.petaForm.patchValue({
                  lokasi: address,
                  latitude: lat,
                  longitude: lon
                });
              }
            } catch (e) { /* ignore */ }
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
    });
  }

  getAddress(lat: number, lon: number) {
      // API Nominatim untuk Reverse Geocoding
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

      return this.http.get<any>(url).pipe(
      first(), // Pastikan Observable selesai setelah nilai pertama diterima
      map(data => {
        if (data && data.display_name) {
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
    // Clean up Leaflet map to avoid leftover containers when navigating
    try {
      if (this.map) {
        this.map.off();
        this.map.remove();
      }
    } catch (e) { /* ignore cleanup errors */ }
  }  
}
