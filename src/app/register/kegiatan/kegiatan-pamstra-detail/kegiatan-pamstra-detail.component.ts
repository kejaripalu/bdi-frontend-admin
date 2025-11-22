import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { RegisterKegiatanIntelijenPamstra } from '../kegiatan-pamstra.model';
import { RegisterKegiatanIntelijenPamstraService } from '../kegiatan-pamstra.service';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt, 'it');

@Component({
    selector: 'app-kegiatan-pamstra-detail',
    templateUrl: './kegiatan-pamstra-detail.component.html',
    styleUrls: ['./kegiatan-pamstra-detail.component.css'],
    standalone: false
})
export class KegiatanPamstraDetailComponent implements OnInit, OnDestroy {
  giat!: RegisterKegiatanIntelijenPamstra;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  namaBidang: string = null as any;
  namaSektor: string = null as any;
  indexBidang: number = 3;
  indexSektor!: number;
  private giatChangeSub!: Subscription;
  private giatParamSub!: Subscription;
  private giatQueryParamSub!: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private giatService: RegisterKegiatanIntelijenPamstraService,
              private bidangDirektoratSektorService: BidangDirektoratSektorService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.giatParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );
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
    this.giatChangeSub = this.giatService.getOne(this.id).subscribe({
      next: (responseData) => {
        this.giat = responseData;
        this.indexSektor = this.bidangDirektoratSektorService.getSektor()
            .findIndex(obj => {
              return obj.namaSektor === this.giat.sektor;
            });
        this.namaSektor = this.bidangDirektoratSektorService.getSektor()[this.indexSektor].deskripsiSektor!;
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/kegiatan', 'list', 'pamstra-list'], { queryParams: { bidang: this.namaBidang } });
  }

  ngOnDestroy(): void {
    if (this.giatChangeSub) {
      this.giatChangeSub.unsubscribe();
    }
    if (this.giatParamSub) {
        this.giatParamSub.unsubscribe();
    }
    if (this.giatQueryParamSub) {
        this.giatQueryParamSub.unsubscribe()
    }
  }
}
