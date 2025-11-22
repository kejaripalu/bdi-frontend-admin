import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-delete-modal',
    templateUrl: './delete-modal.component.html',
    styleUrls: ['./delete-modal.component.css'],
    standalone: false
})
export class DeleteModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  onClickDelete() {
    this.activeModal.close();
  }

}
