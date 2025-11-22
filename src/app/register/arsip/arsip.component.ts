import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArsipHelpComponent } from './arsip-help/arsip-help.component';

@Component({
    selector: 'app-arsip',
    templateUrl: './arsip.component.html',
    styleUrls: ['./arsip.component.css'],
    standalone: false
})
export class ArsipComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onOpenHelp() {
    this.modalService.open(ArsipHelpComponent, { size: 'xl', scrollable: true });
  }

}
