import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterOpsin } from '../opsin.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RegisterOpsinService } from '../opsin.service';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';

@Component({
    selector: 'app-opsin-detail',
    templateUrl: './opsin-detail.component.html',
    styleUrls: ['./opsin-detail.component.css'],
    standalone: false
})
export class OpsinDetailComponent implements OnInit, OnDestroy {
  opsin!: RegisterOpsin;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  namaBidang: string = null as any;
  namaSektor: string = null as any;
  indexBidang!: number;
  indexSektor!: number;
  private opsinChangeSub!: Subscription;
  private opsinParamSub!: Subscription;
  private opsinQueryParamSub!: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private opsinService: RegisterOpsinService,
              private bidangDirektoratSektorService: BidangDirektoratSektorService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.opsinParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );
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
    this.opsinChangeSub = this.opsinService.getOne(this.id).subscribe({
      next: (responseData) => {
        this.opsin = responseData;
        this.indexSektor = this.bidangDirektoratSektorService.getSektor()
            .findIndex(obj => {
              return obj.namaSektor === this.opsin.sektor;
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
    this.router.navigate(['/opsin', 'list'], { queryParams: { bidang: this.namaBidang } });
  }

  ngOnDestroy(): void {
    if (this.opsinChangeSub) {
      this.opsinChangeSub.unsubscribe();
    }
    if (this.opsinParamSub) {
        this.opsinParamSub.unsubscribe();
    }
    if (this.opsinQueryParamSub) {
        this.opsinQueryParamSub.unsubscribe()
    }
  }

}
