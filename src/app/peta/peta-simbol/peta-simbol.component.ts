import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { PetaSimbolHelpComponent } from './peta-simbol-help/peta-simbol-help.component';

@Component({
  selector: 'app-peta-simbol',
  templateUrl: './peta-simbol.component.html',
  styleUrl: './peta-simbol.component.css',
  standalone: false
})
export class PetaSimbolComponent implements OnInit, OnDestroy {

  namaBidang: string = null as any;
  kodeRegister: string = null as any;
  private bidangQueryParamSub!: Subscription;

  constructor(
    private bidangDirektoratSektorService: BidangDirektoratSektorService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

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
              this.kodeRegister = 'D.IN.2';
            } else if(indexBidang === 1) {
              this.kodeRegister = 'D.IN.3';
            } else if(indexBidang === 2) {
              this.kodeRegister = 'D.IN.4';
            } else if(indexBidang === 3) {
              this.kodeRegister = 'D.IN.5';
            } else if(indexBidang === 4) {
              this.kodeRegister = 'D.IN.6';
            } else {
              this.kodeRegister = null as any;
            }
      });
  }

  onOpenHelp() {
        this.modalService.open(PetaSimbolHelpComponent, { size: 'xl', scrollable: true });
  }

  ngOnDestroy(): void {
    if (this.bidangQueryParamSub) {
      this.bidangQueryParamSub.unsubscribe();
    }
  }
}
