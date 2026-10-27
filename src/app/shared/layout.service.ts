import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

const TOGGLED_CLASS = 'sb-sidenav-toggled';
const DESKTOP_MIN_WIDTH = 992;

/**
 * Sidebar open/close state. Keeps the `sb-sidenav-toggled` class on <body>, which the
 * layout CSS reads (on desktop it hides the sidebar, on mobile it shows it).
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  constructor(@Inject(DOCUMENT) private document: Document) { }

  toggleSidebar(): void {
    this.document.body.classList.toggle(TOGGLED_CLASS);
  }

  /** Closes the off-canvas sidebar; a no-op on desktop where the class means "hidden". */
  closeSidebarOnMobile(): void {
    if (this.isMobile && this.document.body.classList.contains(TOGGLED_CLASS)) {
      this.document.body.classList.remove(TOGGLED_CLASS);
    }
  }

  get isMobile(): boolean {
    return (this.document.defaultView?.innerWidth ?? DESKTOP_MIN_WIDTH) < DESKTOP_MIN_WIDTH;
  }
}
