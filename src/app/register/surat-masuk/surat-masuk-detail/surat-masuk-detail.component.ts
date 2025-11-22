import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SuratMasuk } from '../surat-masuk.model';
import { SuratMasukService } from '../surat-masuk.service';

@Component({
    selector: 'app-surat-masuk-detail',
    templateUrl: './surat-masuk-detail.component.html',
    styleUrls: ['./surat-masuk-detail.component.css'],
    standalone: false
})
export class SuratMasukDetailComponent implements OnInit, OnDestroy {
  suratMasuk!: SuratMasuk;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  jenisSurat: string = null as any;
  private suratMasukChangeSub!: Subscription;
  private suratMasukParamSub!: Subscription;
  private suratMasukQueryParamSub!: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private suratMasukService: SuratMasukService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.suratMasukParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    )
    this.suratMasukQueryParamSub = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.jenisSurat = queryParams['jenisSurat']?.toUpperCase() !== 'RAHASIA' ? 'BIASA' : 'RAHASIA';
      }
    )

    this.suratMasukChangeSub = this.suratMasukService.getOneSuratMasuk(this.id).subscribe({
      next: (responseData) => {
        this.suratMasuk = responseData;
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    })
  }

  onCancel() {
    if (this.jenisSurat === 'RAHASIA') {
      this.router.navigate(['/surat-masuk', 'rahasia'], {queryParams: {jenisSurat: this.jenisSurat}});
    } else {
      this.router.navigate(['/surat-masuk', 'biasa'], {queryParams: {jenisSurat: this.jenisSurat}});
    }
  }
  
  ngOnDestroy(): void {
      if (this.suratMasukChangeSub) {
          this.suratMasukChangeSub.unsubscribe();
      }
      if (this.suratMasukParamSub) {
          this.suratMasukParamSub.unsubscribe();
      }
      if (this.suratMasukQueryParamSub) {
          this.suratMasukQueryParamSub.unsubscribe()
      }
  }

}
