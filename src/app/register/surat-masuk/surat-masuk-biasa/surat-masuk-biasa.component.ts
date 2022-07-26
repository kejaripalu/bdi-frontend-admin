import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Month } from 'src/app/shared/month';
import { SuratMasuk } from '../surat-masuk.model';
import { SuratMasukService } from '../surat-masuk.service';

@Component({
  selector: 'app-surat-masuk-biasa',
  templateUrl: './surat-masuk-biasa.component.html',
  styleUrls: ['./surat-masuk-biasa.component.css']
})
export class SuratMasukBiasaComponent implements OnInit, OnDestroy {
  suratMasuk: SuratMasuk[] = [];
  month = Object.keys(Month).filter((v) => isNaN(Number(v)));
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();
  year: number[] = [];
  isLoading: boolean = false;
  error: string = null as any;
  private suratMasukChangedSub!: Subscription;

  constructor(private suratMasukService: SuratMasukService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.error = false as any;
    this.isLoading = true;
    this.getYear();
    this.suratMasukChangedSub = this.suratMasukService.getSuratMasuk(0, 20, 'BIASA', 10)
      .subscribe({
        next: (responseData) => {
          // console.log(responseData);
          this.suratMasuk = responseData.content;
          this.isLoading = false;
        },
        error: (errorMessage) => {
          // console.log(errorMessage);
          this.error = 'Aduh... Gagal load data dari server!!!';
          this.isLoading = false;
        }
      });
  }

  onNewSuratMasuk() {
    this.router.navigate(['form'], {relativeTo: this.route});
  }

  getYear() {
    for (let startYear = 2019; startYear <= this.currentYear; startYear++) {
      this.year.push(startYear);
    }
  }

  ngOnDestroy(): void {
      if (this.suratMasukChangedSub) {
          this.suratMasukChangedSub.unsubscribe();
      }
  }

}
