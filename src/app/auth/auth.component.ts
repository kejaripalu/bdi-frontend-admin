import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Theme, ThemeService } from '../shared/theme.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
    standalone: false
})
export class AuthComponent implements OnInit, OnDestroy {
  tahun = new Date().getFullYear();
  isLoading: boolean = false;
  errorText: string = null as any;
  showPassword: boolean = false;
  theme: Theme = 'light';
  private themeSub: Subscription = null as any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeSub = this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }

  onToggleTheme() {
    this.themeService.toggle();
  }

  onTogglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy(): void {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    const username = form.value.username;
    const password = form.value.password;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.errorText = null as any;
        this.router.navigate(['/dashboard']);
      },
      error: (errorMessage: any) => {
        this.errorText = errorMessage;
        this.isLoading = false;
      }
    });

    form.reset();
  }

}
