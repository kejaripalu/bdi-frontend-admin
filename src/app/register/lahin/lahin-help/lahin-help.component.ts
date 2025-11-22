import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-lahin-help',
    templateUrl: './lahin-help.component.html',
    styleUrls: ['./lahin-help.component.css'],
    standalone: false
})
export class LahinHelpComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
