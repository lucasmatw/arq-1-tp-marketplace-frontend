import {  EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Credentials, CredentialsService } from '../auth/credentials.service';
import { map } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginContext {
  email: string;
  password: string;
  remember?: boolean;
}
export interface ChangePasswordContext {
  email: string;
  password: string;
  new_password: string;
}
export interface RegisterContext {
  name: string;
  last_name: string;
  mail: string;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class MoneyAccountService {
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}
  $emitter = new EventEmitter();
  emitirEvento() {
    this.$emitter.emit();
}
  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
   availableMoney(): Observable<any> {

    return this.httpClient.get<string>( '/money_account' + '?' + 'userId='+this.credentialsService.getId(), {responseType:'json'})
    .pipe(
      map((response) => {

        return response;
      })
    );;
  }
}
