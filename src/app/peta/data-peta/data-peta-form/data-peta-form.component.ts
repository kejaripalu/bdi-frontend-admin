import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataPetaService } from '../data-peta.service';
import { BidangDirektoratSektorPetaService } from 'src/app/shared/bidang-direktorat/bidang-direktorat-sektor-peta.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CurrentDateTimeService } from 'src/app/shared/curent-date-time.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-data-peta-form',
  templateUrl: './data-peta-form.component.html',
  styleUrls: ['./data-peta-form.component.css']
})
export class DataPetaFormComponent implements OnInit {
  
  petaForm!: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isLoadingEditForm: boolean = false;
  error: string = null as any;
  editModeError: boolean = false;
  private petaFormSub!: Subscription;
  private petaSub!: Subscription;
  private petaParamSub!: Subscription;
  private petaQueryParamSub!: Subscription;
  private id: String = null as any;
  namaBidang: string = null as any;
  title: string = null as any;
  indexBidang!: number;
  message: string = null as any;
  sektorList: any[] = [];
  namaSektorSelected: string = null as any;
  deskripsiSektorSelected: string = null as any;
  currentNotificationStatus: boolean = false;

  constructor(
    private petaService: DataPetaService,
    private sektorPetaService: BidangDirektoratSektorPetaService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar, // service calendar NgBootStrap
    private currentDateTimeService: CurrentDateTimeService,
    private notificationStatusService: NotificationService
) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.isLoadingEditForm = false;
    this.petaParamSub = this.route.params
          .subscribe((params: Params) => {
            this.isEditMode = params['id'] != null;
            this.id = params['id'];
    });
  }

}
