import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { DataPetaService } from '../../data-peta/data-peta.service';
import { BidangDirektoratSektorPetaService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor-peta.service';
import { DataPeta } from '../../data-peta/data-peta.model';
import { ToastService } from 'src/app/shared/toast.service';
import { Message } from 'src/app/shared/message';

// Definisikan custom icon Leaflet
const ICON = {
    iconSize: [40, 40] as L.PointTuple, 
    iconAnchor: [19, 38] as L.PointTuple, 
    popupAnchor: [0, -38] as L.PointTuple 
};

@Component({
  selector: 'app-peta-simbol-view',
  templateUrl: './peta-simbol-view.component.html',
  styleUrl: './peta-simbol-view.component.css',
  standalone: false
})
export class PetaSimbolViewComponent implements OnInit, OnDestroy, AfterViewInit {
  
  isLoading: boolean = false;
  private petaQueryParamSub!: Subscription;
  title?: string;
  currentYear = new Date().getFullYear(); // get current year
  year: number[] = [];
  indexBidang!: number;
  namaBidang: string = null as any;
  private dataPetaSub!: Subscription;
  error: string = null as any;
  private message: Message = new Message();
  sektorList: any[] = [];

  // Maps
  private map!: L.Map;  
  public dataPeta: DataPeta[] = [];
  private markerGroup!: L.FeatureGroup; // Untuk tracking marker group
  private mapInitAttempts = 0; // Counter untuk retry initMap

  constructor(
    private sektorPetaService: BidangDirektoratSektorPetaService,
    private activateRoute: ActivatedRoute,
    public toastService: ToastService,
    private dataPetaService: DataPetaService
  ) { }
  
  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.getYear();
    this.petaQueryParamSub = this.activateRoute.queryParams
      .subscribe((queryParams: Params) => {
        this.indexBidang = this.sektorPetaService.getBidangDirektori()
          .findIndex(obj => {
            return obj.namaBidang === queryParams['bidang'];
          });
        // if index not found set to index 0 (IPOLHANKAM)
        if (this.indexBidang < 0) {
          this.indexBidang = 0;
        }
        this.title = this.sektorPetaService.getBidangDirektori()[this.indexBidang].deskripsiBidang;
        this.namaBidang = this.sektorPetaService.getBidangDirektori()[this.indexBidang].namaBidang!;
        this.loadDataPeta();
    });
  }
  
  loadDataPeta() {
    this.dataPetaSub = this.dataPetaService.getByBidangDirektoratTahun(
      this.namaBidang,
      this.currentYear.toString()
    ).subscribe({
      next: (response) => {
        this.dataPeta = response;
        this.isLoading = false;
        // Setelah data tersedia, tambahkan marker dan sesuaikan bounds jika peta telah diinisialisasi
        try {
          this.addWaypoints();
          this.fitMapToBounds();
        } catch (err) {
          console.error('Gagal menambahkan waypoints atau menyesuaikan bounds:', err);
        }
      },
      error: () => {
          this.error = this.message.errorGetData
          this.isLoading = false;
        }    
    });
    
    this.loadSektorData();
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

  getYear() {
    for (let startYear = 2019; startYear <= this.currentYear; startYear++) {
      this.year.push(startYear);
    }
  }

  getImageSektor(namaSektor: string): string {
    return `assets/images/simbol-sektor/${namaSektor}.png`;
  }

  private initMap(): void {
    // Periksa apakah map container ada di DOM
    const mapEl = document.getElementById('map');
    if (!mapEl || (mapEl.clientWidth === 0 && mapEl.clientHeight === 0)) {
      // Jika belum, retry dengan delay
      if (this.mapInitAttempts < 10) {
        this.mapInitAttempts++;
        setTimeout(() => this.initMap(), 100);
      } else {
        console.warn('Map element tidak ditemukan atau tidak visible setelah 10 attempts');
      }
      return;
    }

    // Reset counter jika berhasil
    this.mapInitAttempts = 0;

    // Inisialisasi peta
    this.map = L.map('map').setView([0, 0], 2); 

    // 2. Tambahkan Tile Layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors' 
    }).addTo(this.map);
    
    // Inisialisasi marker group untuk tracking markers
    this.markerGroup = L.featureGroup().addTo(this.map);
  }

  private addWaypoints(): void {
    if (!this.map) return;
    if (!this.dataPeta || this.dataPeta.length === 0) return;

    // Bersihkan semua marker lama sebelum menambahkan yang baru
    this.clearMarkers();

    this.dataPeta.forEach(waypoint => {
      const coords: [number, number] = [waypoint.latitude, waypoint.longitude];

      // 🔑 1. Buat Ikon Kustom dari nama file di data
      const dynamicIcon = this.createCustomIcon(waypoint.sektor);
      
      const marker = L.marker(coords, { icon: dynamicIcon });
      
      const popupContent = `
          <b>Sektor:</b> ${waypoint.sektor.replace(/_/g, ' ')}<br>
          <hr style="margin: 5px 0;">
          <strong>Apa yang terjadi:</strong> ${waypoint.apa}<br>
          <hr style="margin: 5px 0;">
          <strong>Lokasi:</strong> ${waypoint.lokasi}
      `;
      
      marker.bindPopup(popupContent);
      
      // Tambahkan marker ke markerGroup
      this.markerGroup.addLayer(marker);
    });
  }

  private clearMarkers(): void {
    if (this.markerGroup) {
      this.markerGroup.clearLayers();
    }
  }
  
  private fitMapToBounds(): void {
    if (!this.map) return;
    
    // Default waypoint jika data kosong
    const defaultLat = -0.8970856;
    const defaultLon = 119.8663171;
    
    if (!this.dataPeta || this.dataPeta.length === 0) {
      // Jika data kosong, bersihkan semua markers dan tampilkan default waypoint
      this.clearMarkers();
      this.map.setView([defaultLat, defaultLon], 13);
      return;
    }
    
    // 1. Ambil semua koordinat
    const latLngs: L.LatLngExpression[] = this.dataPeta.map(waypoint => [waypoint.latitude, waypoint.longitude]);
    
    // 2. Buat objek bounds dari semua koordinat
    const bounds = L.latLngBounds(latLngs);
    
    // 3. Paskan tampilan peta ke bounds ini
    this.map.fitBounds(bounds, { 
        padding: [50, 50], // Tambahkan padding (jarak tepi) agar marker tidak mepet batas
        maxZoom: 16 // Batasi zoom agar tidak terlalu dekat jika waypoint terlalu berdekatan
    });
  }

  createCustomIcon(filename: string): L.Icon {
    return L.icon({
        iconUrl: `assets/images/simbol-sektor/${filename}.png`,
        className: 'custom-marker-icon', // Tambahkan class untuk styling
        ...ICON // Spread operator untuk menggunakan properti umum
    });
  }

  ngOnDestroy(): void {
    if (this.petaQueryParamSub) {
      this.petaQueryParamSub.unsubscribe();
    }
    if (this.dataPetaSub) {
      this.dataPetaSub.unsubscribe();
    }
    this.toastService.clear();
    
    // Clear all markers and marker group
    try {
      if (this.markerGroup) {
        this.markerGroup.clearLayers();
        if (this.map) {
          this.map.removeLayer(this.markerGroup);
        }
      }
    } catch (e) { /* ignore cleanup errors */ }
    
    // Clean up Leaflet map to avoid leftover containers when navigating
    try {
      if (this.map) {
        this.map.off();
        this.map.remove();
      }
    } catch (e) { /* ignore cleanup errors */ }
  }
}
