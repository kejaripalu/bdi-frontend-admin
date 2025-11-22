import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PphppmHelpComponent } from './pphppm-help/pphppm-help.component';

@Component({
    selector: 'app-pphppm',
    templateUrl: './pphppm.component.html',
    styleUrls: ['./pphppm.component.css'],
    standalone: false
})
export class PphppmComponent implements OnInit {
  
  constructor(private modalService: NgbModal) { }
  
  ngOnInit(): void {
  }
  
  onOpenHelp() {
    this.modalService.open(PphppmHelpComponent, {size: 'xl', scrollable: true});
  }

}
