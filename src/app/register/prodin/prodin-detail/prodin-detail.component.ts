import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProdukIntelijen } from '../prodin.model';
import { ProdukIntelijenService } from '../prodin.service';

@Component({
    selector: 'app-prodin-detail',
    templateUrl: './prodin-detail.component.html',
    styleUrls: ['./prodin-detail.component.css'],
    standalone: false
})
export class ProdinDetailComponent implements OnInit, OnDestroy {
  prodin!: ProdukIntelijen;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  private prodinChangeSub!: Subscription;
  private prodinParamSub!: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private prodinService: ProdukIntelijenService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.prodinParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );

    this.prodinChangeSub = this.prodinService.getOneProdin(this.id).subscribe({
      next: (responseData) => {
        this.prodin = responseData;
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  onCancel() {
      this.router.navigate(['/prodin', 'list']);
  }

  ngOnDestroy(): void {
    if (this.prodinChangeSub) {
      this.prodinChangeSub.unsubscribe();
    }
    if (this.prodinParamSub) {
        this.prodinParamSub.unsubscribe();
    }
  }

}
