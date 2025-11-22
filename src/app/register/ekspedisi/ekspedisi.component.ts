import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EkspedisiHelpComponent } from './ekspedisi-help/ekspedisi-help.component';

@Component({
    selector: 'app-ekspedisi',
    templateUrl: './ekspedisi.component.html',
    styleUrls: ['./ekspedisi.component.css'],
    standalone: false
})
export class EkspedisiComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onOpenHelp() {
    const modalHelp = this.modalService.open(EkspedisiHelpComponent, { size: 'xl', scrollable: true });
  }

}
