import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuratMasukHelpComponent } from './surat-masuk-help/surat-masuk-help.component';

@Component({
    selector: 'app-surat-masuk',
    templateUrl: './surat-masuk.component.html',
    styleUrls: ['./surat-masuk.component.css'],
    standalone: false
})
export class SuratMasukComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onOpenHelp() {
    this.modalService.open(SuratMasukHelpComponent, { size: 'xl', scrollable: true });
  }

}
