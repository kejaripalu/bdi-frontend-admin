import { query } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Bidang } from 'src/app/shared/bidang-direktorat/bidang';
import { BidangDirektoratSektorService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor.service';
import { DataPetaHelpComponent } from './data-peta-help/data-peta-help.component';

@Component({
  selector: 'app-data-peta',
  templateUrl: './data-peta.component.html',
  styleUrls: ['./data-peta.component.css']
})
export class DataPetaComponent implements OnInit, OnDestroy {

  bidang: Bidang[] = [];
  namaBidang: string = null as any;
  private bidangQueryParamSub!: Subscription;

  constructor(private bidangDirektoratSektorService: BidangDirektoratSektorService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.bidangQueryParamSub = this.route.queryParams
        .subscribe((queryParams) => {
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
    this.router.navigate(['/data-peta', 'list'], {
      queryParams: { bidang: namaBidang }
    });
  }

  onOpenHelp() {
      const modalHelp = this.modalService.open(DataPetaHelpComponent, { size: 'xl', scrollable: true });
  }

  ngOnDestroy(): void {
    if (this.bidangQueryParamSub) {
      this.bidangQueryParamSub.unsubscribe();
    }
  }

}
