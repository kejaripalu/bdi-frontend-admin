import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterLahin } from '../lahin.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RegisterTelaahanIntelijenService } from '../lahin.service';

@Component({
    selector: 'app-lahin-detail',
    templateUrl: './lahin-detail.component.html',
    styleUrls: ['./lahin-detail.component.css'],
    standalone: false
})
export class LahinDetailComponent implements OnInit, OnDestroy {
  lahin!: RegisterLahin;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  private lahinChangeSub!: Subscription;
  private lahinParamSub!: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private lahinService: RegisterTelaahanIntelijenService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.lahinParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );

    this.lahinChangeSub = this.lahinService.getOne(this.id).subscribe({
      next: (responseData) => {
        this.lahin = responseData;
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/lahin', 'list']);
  }

  ngOnDestroy(): void {
    if (this.lahinChangeSub) {
        this.lahinChangeSub.unsubscribe();
    }
    if (this.lahinParamSub) {
        this.lahinParamSub.unsubscribe();
    }
  }

}
