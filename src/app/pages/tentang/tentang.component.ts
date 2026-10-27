import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-tentang',
    templateUrl: './tentang.component.html',
    standalone: false
})
export class TentangComponent {
  version = environment.version;
  tahun = new Date().getFullYear();
}
