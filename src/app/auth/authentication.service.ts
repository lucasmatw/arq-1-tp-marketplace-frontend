import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Credentials, CredentialsService } from './credentials.service';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}
export interface RegisterContext {
  name: string;
  lastName: string;
  mail: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    let credentials = JSON.stringify(context);

    return this.httpClient
      .post('/user/login', credentials, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        map((response) => {
          let token = (<any>response).token;
          const data = {
            username: context.email,
            token: token,
          };
          this.credentialsService.setCredentials(data, context.remember);
          return data;
        })
      );
  }

  forgetPassword(context: LoginContext): Observable<Credentials> {
    let credentials = JSON.stringify(context);

    return this.httpClient
      .post('/user/forgetPassword', credentials, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        map((response) => {
          let token = (<any>response).token;
          const data = {
            username: context.email,
            token: token,
          };
          return data;
        })
      );
  }

  register(context: RegisterContext): Observable<Credentials> {
    let credentials = JSON.stringify(context);

    return this.httpClient
      .post('/user/register', credentials, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        map((response) => {
          let token = (<any>response).token;
          const data = {
            username: context.mail,
            token: token,
          };
          this.credentialsService.setCredentials(data, true);
          return data;
        })
      );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
