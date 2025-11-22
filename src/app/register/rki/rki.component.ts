import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Bidang } from 'src/app/shared/bidang-direktorat/bidang';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { RkiHelpComponent } from './rki-help/rki-help.component';

@Component({
    selector: 'app-rki',
    templateUrl: './rki.component.html',
    styleUrls: ['./rki.component.css'],
    standalone: false
})
export class RkiComponent implements OnInit, OnDestroy {
  bidang: Bidang[] = [];
  namaBidang: string = null as any;
  private rkiQueryParamSub!: Subscription; 

  constructor(private bidangDirektoratSektorService: BidangDirektoratSektorService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.rkiQueryParamSub = this.route.queryParams
        .subscribe((queryParams: Params) => {
          let indexBidang = this.bidangDirektoratSektorService.getBidangDirektori()
              .findIndex(obj => {
                return obj.namaBidang === queryParams['bidang'];
          });
          // if index not found set to index 0 (IPOLHANKAM)
          if (indexBidang < 0) {
              indexBidang = 0;
          }       
          this.namaBidang = this.bidangDirektoratSektorService.getBidangDirektori()[indexBidang].namaBidang!;            
    });
    this.bidang = this.bidangDirektoratSektorService.getBidangDirektori();  
  }

  onBidangChange(namaBidang: string) {
    this.router.navigate(['/rki', 'list'], {
      queryParams: { bidang: namaBidang }
    });
  }

  onOpenHelp() {
    const modalHelp = this.modalService.open(RkiHelpComponent, { size: 'xl', scrollable: true });
  }

  ngOnDestroy(): void {
    if (this.rkiQueryParamSub) {
      this.rkiQueryParamSub.unsubscribe();
    }
  }

}
