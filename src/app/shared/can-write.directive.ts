import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * Structural directive that renders its element only when the session may write
 * (create/update/delete). GUEST sessions are read-only. UI convenience only: the server
 * still answers 403 to a GUEST write.
 */
@Directive({
    selector: '[appCanWrite]',
    standalone: false
})
export class CanWriteDirective implements OnInit, OnDestroy {
  private userSub: Subscription = null as any;
  private rendered = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(() => {
      const allowed = this.authService.canWrite;
      if (allowed && !this.rendered) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
      } else if (!allowed && this.rendered) {
        this.viewContainer.clear();
        this.rendered = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
