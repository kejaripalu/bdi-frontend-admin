import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DashboardService } from './dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
  private userSub: Subscription = null as any;
  private countProdinSub: Subscription = null as any;
  private countPphPpmSub: Subscription = null as any;
  private countProgramPenkumLuhkumSub: Subscription = null as any;
  countLapinhar: number = 0;
  countLapinsus: number = 0;
  countLaphastug: number = 0;
  countLapopsin: number = 0;
  countPPH: number = 0;
  countPPM: number = 0;
  countBinmatkum: number = 0;
  countJms: number = 0;
  countJaksaMenyapa: number = 0;
  isAuthenticated: boolean = false;
  currentYear = new Date().getFullYear(); // get current year
  error: string = null as any;
  year: number[] = [];
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private dasboardService: DashboardService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    this.checkLogedReloadPage();
    this.getYear();
    this.loadCardDataView();
  }

  checkLogedReloadPage() {
    const appData: {
      loged: string
    } = JSON.parse(localStorage.getItem('appData')!);

    if (!appData) {
      const appData = {
        'loged': 'yes'
      }
      localStorage.setItem('appData', JSON.stringify(appData));
      window.location.reload();
    }
  }

  loadCardDataView() {
    this.loadCardProdin();
    this.loadCardPphPpm();
    this.loadCardProgramPenkumLuhkum();
  }
  
  loadCardProdin() {
    this.isLoading = true;
    this.countProdinSub = this.dasboardService.getProdinCount(
      this.currentYear.toString())
      .subscribe({
        next: (response) => {
          this.countLapinhar = response.countLapinhar;
          this.countLapinsus = response.countLapinsus;
          this.countLaphastug = response.countLaphastug;
          this.countLapopsin = response.countLapopsin;
          this.isLoading = false;
        },
        error: () => {
          this.error = "Error show data";
          this.isLoading = false;
        }
      });
  }

  loadCardPphPpm() {
    this.isLoading = true;
    this.countPphPpmSub = this.dasboardService.getPphPpmCount(
      this.currentYear.toString())
      .subscribe({
        next: (response) => {
          this.countPPH = response.countPPH;
          this.countPPM = response.countPPM;
          this.isLoading = false;
        },
        error: () => {
          this.error = "Error show data";
          this.isLoading = false;
        }
      });
  }

  loadCardProgramPenkumLuhkum() {
    this.isLoading = true;
    this.countProgramPenkumLuhkumSub = this.dasboardService.getProgramPenkumLuhkumCount(
      this.currentYear.toString())
      .subscribe({
        next: (response) => {
          this.countBinmatkum = response.countBinmatkum;
          this.countJms = response.countJms;
          this.countJaksaMenyapa = response.countJaksaMenyapa;
          this.isLoading = false;
        },
        error: () => {
          this.error = "Error show data";
          this.isLoading = false;
        }
      });
  }

  getYear() {
    for (let startYear = 2019; startYear <= this.currentYear; startYear++) {
      this.year.push(startYear);
    }
  }

  updateYearSelected(year: any) {
    this.currentYear = +year;
    this.isLoading = true;
    this.loadCardDataView();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.countProdinSub) {
      this.countProdinSub.unsubscribe();
    }
    if (this.countPphPpmSub) {
      this.countPphPpmSub.unsubscribe();
    }
    if (this.countProgramPenkumLuhkumSub) {
      this.countProgramPenkumLuhkumSub.unsubscribe();
    }
  }

}
