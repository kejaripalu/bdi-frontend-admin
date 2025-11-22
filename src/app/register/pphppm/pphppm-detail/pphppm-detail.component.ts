import { Component, OnDestroy, OnInit } from '@angular/core';
import { RegisterPPHPPM } from '../pphppm.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RegisterPPHPPMService } from '../pphppm.service';

@Component({
    selector: 'app-pphppm-detail',
    templateUrl: './pphppm-detail.component.html',
    styleUrls: ['./pphppm-detail.component.css'],
    standalone: false
})
export class PphppmDetailComponent implements OnInit, OnDestroy {
  pphppm!: RegisterPPHPPM;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  private pphppmParamSub!: Subscription;
  private pphppmSub!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pphppmService: RegisterPPHPPMService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.pphppmParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );

    this.pphppmSub = this.pphppmService.getOne(this.id).subscribe({
      next: (responseData) => {
        this.pphppm = responseData;
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/pphppm', 'list']);
  }

  ngOnDestroy(): void {
    if (this.pphppmParamSub) {
      this.pphppmParamSub.unsubscribe();
    }
    if (this.pphppmSub) {
      this.pphppmSub.unsubscribe();
    }
  }

}
