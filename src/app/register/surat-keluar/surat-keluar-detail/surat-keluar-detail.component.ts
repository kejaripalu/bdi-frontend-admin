import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SuratKeluar } from '../surat-keluar.model';
import { SuratKeluarService } from '../surat-keluar.service';

@Component({
    selector: 'app-surat-keluar-detail',
    templateUrl: './surat-keluar-detail.component.html',
    styleUrls: ['./surat-keluar-detail.component.css'],
    standalone: false
})
export class SuratKeluarDetailComponent implements OnInit, OnDestroy {
  suratKeluar!: SuratKeluar;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  jenisSurat: string = null as any;
  private suratKeluarChangeSub!: Subscription;
  private suratKeluarParamSub!: Subscription;
  private suratKeluarQueryParamSub!: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private suratKeluarService: SuratKeluarService) { }
  
  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.suratKeluarParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );
    this.suratKeluarQueryParamSub = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.jenisSurat = queryParams['jenisSurat']?.toUpperCase() !== 'R' ? 'BIASA' : 'RAHASIA';
      }
    );

    this.suratKeluarChangeSub = this.suratKeluarService.getOneSuratKeluar(this.id).subscribe({
      next: (responseData) => {
        this.suratKeluar = responseData;
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
      this.router.navigate(['/surat-keluar', 'rahasia'], {queryParams: {jenisSurat: 'R'}});
    } else {
      this.router.navigate(['/surat-keluar', 'biasa'], {queryParams: {jenisSurat: 'B'}});
    }
  }

  getColor() {
    return this.suratKeluar.jenisSurat === 'RAHASIA' ? 'red' : 'green';
  }

  ngOnDestroy(): void {
    if (this.suratKeluarChangeSub) {
      this.suratKeluarChangeSub.unsubscribe();
    }
    if (this.suratKeluarParamSub) {
        this.suratKeluarParamSub.unsubscribe();
    }
    if (this.suratKeluarQueryParamSub) {
        this.suratKeluarQueryParamSub.unsubscribe()
    }
  }
  
}
