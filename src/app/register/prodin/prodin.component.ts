import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProdinHelpComponent } from './prodin-help/prodin-help.component';

@Component({
    selector: 'app-prodin',
    templateUrl: './prodin.component.html',
    styleUrls: ['./prodin.component.css'],
    standalone: false
})
export class ProdinComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onOpenHelp() {
    const modalHelp = this.modalService.open(ProdinHelpComponent, { size: 'xl', scrollable: true });
  }

}
