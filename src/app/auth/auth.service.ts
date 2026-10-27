import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { isReadOnly, rolesFromToken } from './roles';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private endPoint = environment.baseUrl + '/login';

  user = new BehaviorSubject<User>(null as any);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.http.post<Response>(this.endPoint,
        {
          username: username,
          password: password
        }        
      ).pipe(catchError(errorResponse => {
            let errorMessage = 'GAGAL Login';
            if (!errorResponse.error) {
                return throwError(() => errorMessage);
            }
            switch (errorResponse.error.message) {
                case 'INVALID_DATA_INTEGRITY':
                  errorMessage = 'Bro.. Gagal Login, Cek lagi data isian!!!, Cek koneksi ke server';
                  break;
                default:
                  errorMessage = 'GAGAL Login!!! ' //+ errorResponse.error.message;
              }
            return throwError(() => errorMessage);
      }), tap(resData => {
            //decode token dengan jwt-decode
            const decoded = jwtDecode(resData.token);
            const username = decoded.sub!;
            
            //set Unix Timestamp untuk mendapatkan nilai tanggal seconds -> milliseconds *1000
            const startTime = new Date(decoded.iat! * 1000);
            const expireTime = new Date(decoded.exp! * 1000);
            //set time durasi waktu ekspire token dalam menit
            const expirationDuration = (expireTime.getTime() - startTime.getTime());
            
            const user = new User(resData.token, expireTime, username);
            this.user.next(user);
            this.autoLogout(expirationDuration);
            localStorage.setItem('userData', JSON.stringify(user));
          })
      );
  }

  autoLogin() {
    const userData: {
      token: string,
      tokenExpirationDate: string,
      username: string
    } = JSON.parse(localStorage.getItem('userData')!);

    if (!userData) {
      return;
    }    
    const loadedUser = new User(userData.token, new Date(userData.tokenExpirationDate), userData.username);

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const timeNow = new Date().getTime(); 
      const expireTime = new Date(loadedUser.tokenExpirationDate).getTime();

      //set sisa waktu auto logout
      const expirationDuration = expireTime - timeNow;      
      this.autoLogout(expirationDuration)
    }
  }

  /** Roles from the JWT `scopes` claim of the current session (GET /user does not return roles). */
  get roles(): string[] {
    const user = this.user.value;
    return user ? rolesFromToken(user.token) : [];
  }

  /** False only for a GUEST session; hides create/edit/delete actions. */
  get canWrite(): boolean {
    return !isReadOnly(this.roles);
  }

  logout() {
    this.user.next(null as any);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    localStorage.removeItem('appData');
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
    }, expirationDuration);
  }

}

interface Response {
  token: string;
}
