import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';

@Component({
    selector: 'app-opsin-help',
    templateUrl: './opsin-help.component.html',
    styleUrls: ['./opsin-help.component.css'],
    standalone: false
})
export class OpsinHelpComponent implements OnInit, OnDestroy {
  namaBidang: string = null as any;
  kodeSurat: string = null as any;
  penyelenggaraKejagung: string = null as any;
  penyelenggaraKejati: string = null as any;
  private giatQueryParamSub!: Subscription;

  constructor(public activeModal: NgbActiveModal,
              private bidangDirektoratSektorService: BidangDirektoratSektorService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.giatQueryParamSub! = this.route.queryParams
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

          // set help bidang value
          switch(indexBidang) {
            case 0:
              this.kodeSurat = 'R.IN.12';
              this.penyelenggaraKejagung = 'Direktorat A';
              this.penyelenggaraKejati = 'Seksi A';
              break;
            case 1:
              this.kodeSurat = 'R.IN.13';
              this.penyelenggaraKejagung = 'Direktorat B';
              this.penyelenggaraKejati = 'Seksi B';
              break;
            case 2:
              this.kodeSurat = 'R.IN.14';
              this.penyelenggaraKejagung = 'Direktorat C';
              this.penyelenggaraKejati = 'Seksi C';
              break;
            case 3:
              this.kodeSurat = 'R.IN.15';
              this.penyelenggaraKejagung = 'Direktorat D';
              this.penyelenggaraKejati = 'Seksi D';
              break;  
            case 4:
              this.kodeSurat = 'R.IN.16';
              this.penyelenggaraKejagung = 'Direktorat E';
              this.penyelenggaraKejati = 'Seksi E';
              break;
          }
    });    
  }

  ngOnDestroy(): void {
    if (this.giatQueryParamSub) {
      this.giatQueryParamSub.unsubscribe();
    }
  }

}
