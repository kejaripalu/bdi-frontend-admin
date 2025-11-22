import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
    standalone: false
})
export class AuthComponent implements OnInit {
  tahun = new Date().getFullYear();
  isLoading: boolean = false;
  errorText: string = null as any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
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
