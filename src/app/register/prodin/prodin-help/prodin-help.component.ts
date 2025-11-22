import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-prodin-help',
    templateUrl: './prodin-help.component.html',
    styleUrls: ['./prodin-help.component.css'],
    standalone: false
})
export class ProdinHelpComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
