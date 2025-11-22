import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { RegisterKerjaIntelijen } from '../rki.model';
import { RegisterKerjaIntelijenService } from '../rki.service';

@Component({
    selector: 'app-rki-detail',
    templateUrl: './rki-detail.component.html',
    styleUrls: ['./rki-detail.component.css'],
    standalone: false
})
export class RkiDetailComponent implements OnInit, OnDestroy {
  rki!: RegisterKerjaIntelijen;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  namaBidang: string = null as any;
  namaSektor: string = null as any;
  indexBidang!: number;
  indexSektor!: number;
  private rkiChangeSub!: Subscription;
  private rkiParamSub!: Subscription;
  private rkiQueryParamSub!: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private rkiService: RegisterKerjaIntelijenService,
              private bidangDirektoratSektorService: BidangDirektoratSektorService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.rkiParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );
    this.rkiQueryParamSub = this.route.queryParams
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
    this.rkiChangeSub = this.rkiService.getOneRKI(this.id).subscribe({
      next: (responseData) => {
        this.rki = responseData;
        this.indexSektor = this.bidangDirektoratSektorService.getSektor()
            .findIndex(obj => {
              return obj.namaSektor === this.rki.sektor;
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
    this.router.navigate(['/rki', 'list'], { queryParams: { bidang: this.namaBidang } });
  }

  ngOnDestroy(): void {
    if (this.rkiChangeSub) {
        this.rkiChangeSub.unsubscribe();
    }
    if (this.rkiParamSub) {
        this.rkiParamSub.unsubscribe();
    }
    if (this.rkiQueryParamSub) {
        this.rkiQueryParamSub.unsubscribe()
    }
  }

}
