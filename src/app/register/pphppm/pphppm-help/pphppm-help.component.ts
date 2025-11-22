import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-pphppm-help',
    templateUrl: './pphppm-help.component.html',
    styleUrls: ['./pphppm-help.component.css'],
    standalone: false
})
export class PphppmHelpComponent implements OnInit {
  kodeSurat: string = 'R.IN.21';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
