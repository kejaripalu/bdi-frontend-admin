import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-penkumluhkum-help',
    templateUrl: './penkumluhkum-help.component.html',
    styleUrls: ['./penkumluhkum-help.component.css'],
    standalone: false
})
export class PenkumluhkumHelpComponent implements OnInit {
  kodeSurat: string = 'R.IN.22';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
