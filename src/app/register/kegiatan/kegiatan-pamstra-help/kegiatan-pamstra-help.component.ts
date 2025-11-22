import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-kegiatan-pamstra-help',
    templateUrl: './kegiatan-pamstra-help.component.html',
    styleUrls: ['./kegiatan-pamstra-help.component.css'],
    standalone: false
})
export class KegiatanPamstraHelpComponent implements OnInit {
  namaBidang: string = 'Pengamanan Pembangunan Strategis';
  kodeSurat: string = 'R.IN.10';
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    
  }  

}
