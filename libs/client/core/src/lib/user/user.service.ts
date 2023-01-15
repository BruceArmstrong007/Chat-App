import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@prisma/client';
import { BehaviorSubject, iif, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { fromProcedure } from '../client/utils';
import { injectClient } from '../core.di';

type UserData = Omit<User, 'password' | 'refreshToken'>;

@Injectable({
  providedIn: 'any',
})
export class UserService {
  private readonly client = injectClient();
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);



  findUser(data: any) {
    return fromProcedure(this.client.user.findUser.query)(data)
  }
}
