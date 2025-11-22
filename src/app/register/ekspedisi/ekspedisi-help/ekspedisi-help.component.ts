import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ekspedisi-help',
    templateUrl: './ekspedisi-help.component.html',
    styleUrls: ['./ekspedisi-help.component.css'],
    standalone: false
})
export class EkspedisiHelpComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
