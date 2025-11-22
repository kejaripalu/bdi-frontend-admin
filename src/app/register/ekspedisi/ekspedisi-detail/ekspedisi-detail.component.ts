import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ekspedisi } from '../ekspedisi.model';
import { EkspedisiService } from '../ekspedisi.service';

@Component({
    selector: 'app-ekspedisi-detail',
    templateUrl: './ekspedisi-detail.component.html',
    styleUrls: ['./ekspedisi-detail.component.css'],
    standalone: false
})
export class EkspedisiDetailComponent implements OnInit, OnDestroy {
  ekspedisi!: Ekspedisi;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  jenisSurat: string = null as any;
  private ekspedisiChangeSub!: Subscription;
  private ekspedisiParamSub!: Subscription;
  private ekspedisiQueryParamSub!: Subscription;
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private ekspedisiService: EkspedisiService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.ekspedisiParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );
    this.ekspedisiQueryParamSub = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.jenisSurat = queryParams['jenisSurat']?.toUpperCase() !== 'RAHASIA' ? 'BIASA' : 'RAHASIA';
      }
    );

    this.ekspedisiChangeSub = this.ekspedisiService.getOneEkspedisi(this.id).subscribe({
      next: (responseData) => {
        this.ekspedisi = responseData;
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    if (this.jenisSurat === 'RAHASIA') {
      this.router.navigate(['/ekspedisi', 'rahasia'], {queryParams: {jenisSurat: this.jenisSurat}});
    } else {
      this.router.navigate(['/ekspedisi', 'biasa'], {queryParams: {jenisSurat: this.jenisSurat}});
    }
  }

  getColor() {
    return this.ekspedisi.jenisSurat === 'RAHASIA' ? 'red' : 'green';
  }

  ngOnDestroy(): void {
    if (this.ekspedisiChangeSub) {
        this.ekspedisiChangeSub.unsubscribe();
    }
    if (this.ekspedisiParamSub) {
        this.ekspedisiParamSub.unsubscribe();
    }
    if (this.ekspedisiQueryParamSub) {
        this.ekspedisiQueryParamSub.unsubscribe()
    }
  }

}
