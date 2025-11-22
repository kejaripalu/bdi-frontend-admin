import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-rki-help',
    templateUrl: './rki-help.component.html',
    styleUrls: ['./rki-help.component.css'],
    standalone: false
})
export class RkiHelpComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
