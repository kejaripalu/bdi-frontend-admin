import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, exhaustMap, Observable, take, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorsService implements HttpInterceptor {
   
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Only our own API gets the token; third-party requests (e.g. Nominatim) must not.
        const isApiRequest = req.url.startsWith(environment.baseUrl);

        return this.authService.user.pipe(take(1), exhaustMap(user => {
            const token = user ? user.getToken() : null;
            const request = isApiRequest && token
                ? req.clone({ setHeaders: { Authorization: "Bearer " + token } })
                : req;

            return next.handle(request).pipe(
                catchError(error => {
                    // Invalid/expired token on an authenticated API call: clear session and go to login.
                    // The backend answers 401 for a missing token but 403 (empty body) for an invalid or
                    // expired one. Every role may GET, so a 403 on GET can only mean the token is not valid;
                    // a 403 on POST/PUT/DELETE is a GUEST permission denial and keeps the session.
                    const tokenRejected = error instanceof HttpErrorResponse
                        && (error.status === 401 || (error.status === 403 && req.method === 'GET'));
                    if (tokenRejected && isApiRequest && !req.url.endsWith('/login') && this.authService.user.value) {
                        this.authService.logout();
                    }
                    return throwError(() => error);
                })
            );
        }));
    }

}
