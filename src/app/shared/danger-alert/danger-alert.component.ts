import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-danger-alert',
    templateUrl: './danger-alert.component.html',
    styleUrls: ['./danger-alert.component.css'],
    standalone: false
})
export class DangerAlertComponent implements OnInit {
  @Input() message: string = 'Aduh... ada error nih!!!';

  constructor() { }

  ngOnInit(): void {
  }

}
