import { IS_LOGGED_STORAGE_KEY } from './auth.config';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@prisma/client';
import { BehaviorSubject, iif, map, of, switchMap, tap } from 'rxjs';
import { fromProcedure } from '../client/utils';
import { injectClient, injectToken } from '../core.di';

type UserData = Omit<User, 'password' | 'refreshToken'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject<null | UserData>(null);
  private readonly client = injectClient();
  private readonly router = inject(Router);
  private readonly token = injectToken();

  $user = this.currentUser$.asObservable();

  currentUser(){
    return  this.currentUser$.getValue();
  }

  authenticateUser(user: UserData) {
    this.currentUser$.next(user);
    localStorage.setItem(IS_LOGGED_STORAGE_KEY, JSON.stringify(true));
  }

  isUserLoggedIn() {
    return JSON.parse(localStorage.getItem(IS_LOGGED_STORAGE_KEY) ?? 'false');
  }


  isAuth() {
    return this.currentUser$.pipe(map(user => !!user));
  }

  logout() {
    fromProcedure(this.client.auth.logout.mutate)().pipe();

    this.router.navigateByUrl('/');
    this.currentUser$.next(null);
    this.clearStorage();
  }

  login(credential: Pick<User, 'username' | 'password'>) {
    return fromProcedure(this.client.auth.login.query)(credential).pipe(
      tap((response:any) => {
        this.token.setAccessToken(response.token);
      }),
      switchMap(response => iif(() => !!response.token, this.getUser(true), of(response))),
    );
  }

  register(formValue: any){
    return fromProcedure(this.client.user.register.mutate)({
      username: formValue.username,
      password: formValue.password,
      confirmPassword : formValue.confirmPassword
    })
  }

  getUser(login: boolean = false){
    return fromProcedure(this.client.user.getUser.query)().pipe(
      tap((user:any) => {
        this.authenticateUser(user);
        if(login) this.router.navigateByUrl("/user")
      })
    )
  }

  getAccess() {
    return fromProcedure(this.client.auth.accessToken.query)().pipe(
      tap((response:any) => {
        this.token.setAccessToken(response.token);
      }),
      switchMap((response:any) => iif(() => !!response.token, this.getUser(), of(response))),
    );
  }

  clearStorage() {
    localStorage.clear();
  }


}
