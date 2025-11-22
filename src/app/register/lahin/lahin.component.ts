import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LahinHelpComponent } from './lahin-help/lahin-help.component';

@Component({
    selector: 'app-lahin',
    templateUrl: './lahin.component.html',
    styleUrls: ['./lahin.component.css'],
    standalone: false
})
export class LahinComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onOpenHelp() {
    const modalHelp = this.modalService.open(LahinHelpComponent, { size: 'xl', scrollable: true });
  }

}
