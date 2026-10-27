import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LayoutService } from 'src/app/shared/layout.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    standalone: false
})
export class SidebarComponent implements OnInit, OnDestroy {
  private userSub: Subscription = null as any;
  isAuthenticated: boolean = false;
  username: string = null as any;

  constructor(private authService: AuthService, private layoutService: LayoutService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.username = user.username;
      }
    });
  }

  /** On small screens the sidebar is off-canvas: close it once a destination link is chosen. */
  onNavClick(event: Event) {
    const link = (event.target as HTMLElement).closest('a.nav-link');
    if (link && !link.hasAttribute('data-bs-toggle')) {
      this.layoutService.closeSidebarOnMobile();
    }
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
