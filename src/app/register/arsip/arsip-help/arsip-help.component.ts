import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-arsip-help',
    templateUrl: './arsip-help.component.html',
    styleUrls: ['./arsip-help.component.css'],
    standalone: false
})
export class ArsipHelpComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
