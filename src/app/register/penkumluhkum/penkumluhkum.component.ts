import { Component, OnInit } from '@angular/core';
import { PenkumluhkumHelpComponent } from './penkumluhkum-help/penkumluhkum-help.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-penkumluhkum',
    templateUrl: './penkumluhkum.component.html',
    styleUrls: ['./penkumluhkum.component.css'],
    standalone: false
})
export class PenkumluhkumComponent implements OnInit {
  namaBidang: string ='Register Pelaksanaan Kegiatan Penerangan Hukum / Penyuluhan Hukum';
  kodeRegister: string = 'R.IN.22';

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onOpenHelp() {
    this.modalService.open(PenkumluhkumHelpComponent, { size: 'xl', scrollable: true });
  }

}
