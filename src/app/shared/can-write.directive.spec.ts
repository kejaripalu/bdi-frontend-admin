import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { CanWriteDirective } from './can-write.directive';

@Component({
  template: '<button *appCanWrite id="add">Tambah</button><span id="always">x</span>',
  standalone: false
})
class HostComponent { }

function jwt(scopes: string[]): string {
  const enc = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${enc({ alg: 'none' })}.${enc({ sub: 'u', scopes })}.sig`;
}

describe('CanWriteDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, CanWriteDirective],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(HostComponent);
  });

  const has = (id: string) => !!(fixture.nativeElement as HTMLElement).querySelector('#' + id);

  it('hides write actions for a GUEST session', () => {
    auth.user.next(new User(jwt(['ROLE_GUEST']), new Date(Date.now() + 3600e3), 'tamu'));
    fixture.detectChanges();
    expect(has('add')).toBeFalse();
    expect(has('always')).toBeTrue();
  });

  it('shows write actions for USER/ADMIN/SUPERADMIN sessions', () => {
    for (const role of ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN']) {
      fixture = TestBed.createComponent(HostComponent);
      auth.user.next(new User(jwt([role]), new Date(Date.now() + 3600e3), 'x'));
      fixture.detectChanges();
      expect(has('add')).toBeTrue();
    }
  });
});
