import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuratKeluarHelpComponent } from './surat-keluar-help/surat-keluar-help.component';

@Component({
    selector: 'app-surat-keluar',
    templateUrl: './surat-keluar.component.html',
    styleUrls: ['./surat-keluar.component.css'],
    standalone: false
})
export class SuratKeluarComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onOpenHelp() {
    const modalHelp = this.modalService.open(SuratKeluarHelpComponent, { size: 'xl', scrollable: true });
  }

}
