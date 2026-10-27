import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';
import { LayoutService } from './shared/layout.service';
import { ThemeService } from './shared/theme.service';

@Component({
    selector: 'bdi',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  tahun = new Date().getFullYear();
  version = environment.version;
  private userSub: Subscription = null as any;
  isAuthenticated: boolean = false;

  // ThemeService is injected here so the theme (and system-preference tracking) is active app-wide.
  constructor(
    private authService: AuthService,
    private layoutService: LayoutService,
    private themeService: ThemeService) { }

  /** Tapping the dimmed content area closes the off-canvas sidebar on small screens. */
  onContentClick() {
    this.layoutService.closeSidebarOnMobile();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.layoutService.closeSidebarOnMobile();
  }

  ngOnInit(): void {
    this.authService.autoLogin();
    
    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }
  
  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
