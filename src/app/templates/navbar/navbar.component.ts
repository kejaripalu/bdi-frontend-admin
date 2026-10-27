import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LayoutService } from 'src/app/shared/layout.service';
import { Theme, ThemeService } from 'src/app/shared/theme.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {

  private userSub: Subscription = null as any;
  private themeSub: Subscription = null as any;
  isAuthenticated: boolean = false;
  username: string = null as any;
  theme: Theme = 'light';

  constructor(
    private authService: AuthService,
    private layoutService: LayoutService,
    private themeService: ThemeService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      this.username = user ? user.username : null as any;
    });
    this.themeSub = this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }

  onToggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  onToggleTheme() {
    this.themeService.toggle();
  }

  onLogout() {
    this.authService.logout();  
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

}
