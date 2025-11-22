import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterPenkumLuhkum } from '../penkumluhkum.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PenkuluhkumService } from '../penkuluhkum.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-penkumluhkum-detail',
    templateUrl: './penkumluhkum-detail.component.html',
    styleUrls: ['./penkumluhkum-detail.component.css'],
    standalone: false
})
export class PenkumluhkumDetailComponent implements OnInit, OnDestroy {
  penkumluhkum!: RegisterPenkumLuhkum;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  jenisKegiatan: string = null as any;
  private penkumluhkumChangeSub!: Subscription;
  private penkumluhkumParamSub!: Subscription;
  private penkumluhkumQueryParamSub!: Subscription;
  urlFoto1: string = null as any;
  urlFoto2: string = null as any;
  urlFoto3: string = null as any;
  urlFoto4: string = null as any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private penkumluhkumService: PenkuluhkumService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.penkumluhkumParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );
    this.penkumluhkumQueryParamSub = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.jenisKegiatan = queryParams['jenisKegiatan']?.toUpperCase() !== 'PENYULUHAN_HUKUM' ? 'PENERANGAN_HUKUM' : 'PENYULUHAN_HUKUM';
      }
    );
    this.penkumluhkumChangeSub = this.penkumluhkumService.getOne(this.id).subscribe({
      next: (responseData) => {
        this.penkumluhkum = responseData;
        this.isLoading = false;
        this.urlFoto1 = this.penkumluhkum.urlFoto1 != null ? (this.penkumluhkum.urlFoto1 == '' ? null as any : this.penkumluhkum.urlFoto1) : null as any;
        this.urlFoto2 = this.penkumluhkum.urlFoto2 != null ? (this.penkumluhkum.urlFoto2 == '' ? null as any : this.penkumluhkum.urlFoto2) : null as any;
        this.urlFoto3 = this.penkumluhkum.urlFoto3 != null ? (this.penkumluhkum.urlFoto3 == '' ? null as any : this.penkumluhkum.urlFoto3) : null as any;
        this.urlFoto4 = this.penkumluhkum.urlFoto4 != null ? (this.penkumluhkum.urlFoto4 == '' ? null as any : this.penkumluhkum.urlFoto4) : null as any;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    if (this.jenisKegiatan === 'PENYULUHAN_HUKUM') {
      this.router.navigate(['/penkumluhkum', 'luhkum'], { queryParams: { jenisKegiatan: 'PENYULUHAN_HUKUM' } });
    } else {
      this.router.navigate(['/penkumluhkum', 'penkum'], { queryParams: { jenisKegiatan: 'PENERANGAN_HUKUM' } });
    }
  }

  ngOnDestroy(): void {
    if (this.penkumluhkumChangeSub) {
      this.penkumluhkumChangeSub.unsubscribe();
    }
    if (this.penkumluhkumParamSub) {
      this.penkumluhkumParamSub.unsubscribe();
    }
    if (this.penkumluhkumQueryParamSub) {
      this.penkumluhkumQueryParamSub.unsubscribe()
    }
  }

}
