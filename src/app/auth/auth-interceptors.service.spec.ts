import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthInterceptorsService } from './auth-interceptors.service';
import { AuthService } from './auth.service';
import { User } from './user.model';

describe('AuthInterceptorsService', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let auth: AuthService;
  const api = environment.baseUrl + '/surat-masuk';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorsService, multi: true }
      ]
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    spyOn(auth, 'logout');
  });

  afterEach(() => controller.verify());

  function signIn() {
    auth.user.next(new User('abc.def.ghi', new Date(Date.now() + 3600e3), 'tester'));
  }

  it('adds the Bearer token to API requests', () => {
    signIn();
    http.get(api).subscribe();
    const req = controller.expectOne(api);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc.def.ghi');
    req.flush({});
  });

  it('does not send the token to third-party hosts', () => {
    signIn();
    const external = 'https://nominatim.openstreetmap.org/reverse?format=json';
    http.get(external).subscribe();
    const req = controller.expectOne(external);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('sends no Authorization header (and does not throw) when the stored token has expired', () => {
    auth.user.next(new User('abc.def.ghi', new Date(Date.now() - 1000), 'tester'));
    http.get(api).subscribe();
    const req = controller.expectOne(api);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('logs out on 401 from an API request', () => {
    signIn();
    let status = 0;
    http.get(api).subscribe({ error: e => (status = e.status) });
    controller.expectOne(api).flush({ result: 'AUTHENTICATION_FAILED' }, { status: 401, statusText: 'Unauthorized' });
    expect(status).toBe(401);
    expect(auth.logout).toHaveBeenCalledTimes(1);
  });

  it('does not log out on 401 from the login request itself', () => {
    signIn();
    const login = environment.baseUrl + '/login';
    http.post(login, {}).subscribe({ error: () => { } });
    controller.expectOne(login).flush({ result: 'AUTHENTICATION_FAILED' }, { status: 401, statusText: 'Unauthorized' });
    expect(auth.logout).not.toHaveBeenCalled();
  });

  it('logs out on 403 from a GET (every role may read, so the token is invalid or expired)', () => {
    signIn();
    let status = 0;
    http.get(api).subscribe({ error: e => (status = e.status) });
    controller.expectOne(api).flush(null, { status: 403, statusText: 'Forbidden' });
    expect(status).toBe(403);
    expect(auth.logout).toHaveBeenCalledTimes(1);
  });

  it('does not log out on 403 from a GET when there is no session', () => {
    http.get(api).subscribe({ error: () => { } });
    controller.expectOne(api).flush(null, { status: 403, statusText: 'Forbidden' });
    expect(auth.logout).not.toHaveBeenCalled();
  });

  it('keeps the session on 403 from a write (GUEST permission denial) and passes the error through', () => {
    signIn();
    let status = 0;
    http.post(api, {}).subscribe({ error: e => (status = e.status) });
    controller.expectOne(api).flush(null, { status: 403, statusText: 'Forbidden' });
    expect(status).toBe(403);
    expect(auth.logout).not.toHaveBeenCalled();

    http.put(api + '/abc', {}).subscribe({ error: () => { } });
    controller.expectOne(api + '/abc').flush(null, { status: 403, statusText: 'Forbidden' });
    http.delete(api + '/abc').subscribe({ error: () => { } });
    controller.expectOne(api + '/abc').flush(null, { status: 403, statusText: 'Forbidden' });
    expect(auth.logout).not.toHaveBeenCalled();
  });
});
