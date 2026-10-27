import { Component, Input } from '@angular/core';

/** Summary tile used on the dashboard: label, value, icon and optional link, with loading/error states. */
@Component({
    selector: 'app-stat-card',
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.css'],
    standalone: false
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() icon: string = 'bi-bar-chart';
  @Input() description: string = '';
  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  /** Router commands for the footer link; the footer is hidden when empty. */
  @Input() link: any[] | null = null;
  @Input() queryParams: { [key: string]: string } | null = null;
  @Input() linkLabel: string = 'Lihat detail';
}
