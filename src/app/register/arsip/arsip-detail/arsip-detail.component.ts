import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Arsip } from '../arsip.model';
import { ArsipService } from '../arsip.service';

@Component({
    selector: 'app-arsip-detail',
    templateUrl: './arsip-detail.component.html',
    styleUrls: ['./arsip-detail.component.css'],
    standalone: false
})
export class ArsipDetailComponent implements OnInit, OnDestroy {
  arsip!: Arsip;
  isLoading: boolean = false;
  error: string = null as any;
  id!: string;
  jenisSurat: string = null as any;
  private arsipChangeSub!: Subscription;
  private arsipParamSub!: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private arsipService: ArsipService) { }

  ngOnInit(): void {
    this.error = null as any;
    this.isLoading = true;
    this.id = this.route.snapshot.params['id'];
    this.arsipParamSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
      }
    );

    this.arsipChangeSub = this.arsipService.getOne(this.id).subscribe({
      next: (responseData) => {
        this.arsip = responseData;
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  onCancel() {
      this.router.navigate(['/arsip', 'list']);
  }

  ngOnDestroy(): void {
    if (this.arsipChangeSub) {
        this.arsipChangeSub.unsubscribe();
    }
    if (this.arsipParamSub) {
        this.arsipParamSub.unsubscribe();
    }
  }

}
