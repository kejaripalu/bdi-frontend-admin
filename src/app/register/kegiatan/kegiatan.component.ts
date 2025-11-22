import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { KegiatanHelpComponent } from './kegiatan-help/kegiatan-help.component';
import { KegiatanPamstraHelpComponent } from './kegiatan-pamstra-help/kegiatan-pamstra-help.component';

@Component({
    selector: 'app-kegiatan',
    templateUrl: './kegiatan.component.html',
    styleUrls: ['./kegiatan.component.css'],
    standalone: false
})
export class KegiatanComponent implements OnInit, OnDestroy {
  namaBidang: string = null as any;
  kodeRegister: string = null as any;
  private bidangQueryParamSub!: Subscription;

  constructor(private bidangDirektoratSektorService: BidangDirektoratSektorService,
              private route: ActivatedRoute,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.bidangQueryParamSub = this.route.queryParams
      .subscribe((queryParams: Params) => {
        let indexBidang = this.bidangDirektoratSektorService.getBidangDirektori()
            .findIndex(obj => {
              return obj.namaBidang === queryParams['bidang'];
            });
            // if index not found set to index 0 (IPOLHANKAM)
            if (indexBidang < 0) {
                indexBidang = 0;
            }
            this.namaBidang = this.bidangDirektoratSektorService.getBidangDirektori()[indexBidang].deskripsiBidang!;
            // set Kode Register by indexBidang
            if (indexBidang === 0) {
              this.kodeRegister = 'R.IN.7';
            } else if(indexBidang === 1) {
              this.kodeRegister = 'R.IN.8';
            } else if(indexBidang === 2) {
              this.kodeRegister = 'R.IN.9';
            } else if(indexBidang === 3) {
              this.kodeRegister = 'R.IN.10';
            } else if(indexBidang === 4) {
              this.kodeRegister = 'R.IN.11';
            } else {
              this.kodeRegister = null as any;
            }
      });
  }

  onOpenHelp(kodeRegister: string) {
    if(kodeRegister === 'R.IN.10') {
      this.modalService.open(KegiatanPamstraHelpComponent, { size: 'xl', scrollable: true });
    } else {
      this.modalService.open(KegiatanHelpComponent, { size: 'xl', scrollable: true });
    }
  }

  ngOnDestroy(): void {
    if (this.bidangQueryParamSub) {
      this.bidangQueryParamSub.unsubscribe();
    }
  }

}
