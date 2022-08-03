import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {catchError, Observable, Subject, tap} from "rxjs";
import { environment } from "../../../environments/environment";
import {AuthResponse, TokenPayload, User} from "../interfaces";
import jwtDecode from "jwt-decode";
import {UserService} from "./user.service";

@Injectable({providedIn: 'root'})
export class AuthService {

  // public user$: Subject<User> = new Subject<User>();

  private temporaryAuth = false;
  private tokenStorage = localStorage;
  private tokenName = 'auth-token';
  private tokenExpName = 'auth-token-exp';

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {
  }

  login(params: {username: string, password: string, temporaryAuth: boolean}): Observable<any> {
    this.temporaryAuth = params.temporaryAuth;
    if (this.temporaryAuth) {
      this.tokenStorage = sessionStorage;
    }
    // console.log('LOGIN temp auth: ' + this.temporaryAuth);
    console.log('LOGIN');
    return this.http.post<AuthResponse>(`${environment.apiUrl}security/login`, params)
      .pipe(
        tap(this.setToken.bind(this))
      //   catchError(this.handleError.bind(this))
      )
  }

  logout() {
    console.log('LOGOUT')
    this.setToken(null);
    this.userService.setUser(null);
    //todo: send request
    // this.http.get()
  }

  refresh(refreshToken: string): Observable<any> {
    console.log('REFRESH');
    const params = {refreshToken: refreshToken};
    return this.http.post<AuthResponse>(`${environment.apiUrl}security/refresh`, params)
      .pipe(
        tap(this.setToken.bind(this))
        //   catchError(this.handleError.bind(this))
      )
  }

  get token(): string|null {

    console.log('GET TOKEN');

    let token = localStorage.getItem(this.tokenName);
    if (!token) {
      token = sessionStorage.getItem(this.tokenName);
      if (token) {
        this.tokenStorage = sessionStorage;
        this.temporaryAuth = true;
      }
    }

    // console.log('storage:' + this.tokenStorage);

    const exp = parseInt(this.tokenStorage.getItem(this.tokenExpName) || '');
    console.log(exp);

    if (!exp) {
      return null;
    }
    const expDate = new Date(exp);

    console.log('ExpDate: ' + expDate);
    console.log('Now: ' + (new Date()));

    if (new Date() > expDate) {
      console.log('ERROR DATE');
      //todo: refresh token

      let refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        console.log('go to refresh');
        this.refresh(refreshToken).subscribe(() => {
            console.log('refresh subscribe');
            return this.token;
          }
        );

      } else {
        this.logout();
        return null;
      }
    }
    // console.log(token)
    return token;
  }

  isAuthenticated(): boolean {
    // console.log('IS AUTH');
    return  !!this.tokenStorage.getItem(this.tokenName);
  }

  private setToken(response: AuthResponse | null) {
    if (response) {
      // console.log('SET TOKEN');
      // console.log('temp auth: ' + this.temporaryAuth);

      this.tokenStorage.setItem(this.tokenName, response.token);

      const payload: TokenPayload = jwtDecode(response.token);

      // console.log(response)
      // console.log(payload)
      // console.log(response.user)


      const expDate = new Date(payload.exp * 1000);
      // console.log('EXP DATE: ');
      // console.log(payload.exp);
      // console.log(expDate);

      this.tokenStorage.setItem(this.tokenExpName, String(payload.exp * 1000)); //todo: remove

      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      // this.user$.next(response.user);
      this.userService.setUser(response.user);
      // console.log(document.cookie)
      // console.log('SET TOKEN END');
    } else {
      // console.log('NO RESPONSE');
      sessionStorage.clear();
      localStorage.removeItem(this.tokenName);
      localStorage.removeItem(this.tokenExpName);
    }
  }

  // private handleError(error: HttpErrorResponse) {
  //
  //   console.log(error.error.message);

    // const {message} = error.error.error
    //
    //
    // switch (message) {
    //   case 'INVALID_EMAIL':
    //     this.error$.next('неверный email')
    //     break
    //   case 'INVALID_PASSWORD':
    //     this.error$.next('неверный пароль')
    //     break
    //   case 'EMAIL_NOT_FOUND':
    //     this.error$.next('email не найден')
    //     break
    // }
    //
  //   return throwError(() => new Error(error.error.message))
  // }

}
