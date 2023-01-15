import { inject, Injectable } from '@angular/core';
import { Contacts, User } from '@prisma/client';
import { tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { fromProcedure } from '../client/utils';
import { injectClient } from '../core.di';

type UserData = Omit<User, 'password' | 'refreshToken'>;


@Injectable({
  providedIn: 'any',
})
export class UserService {
  private readonly client = injectClient();
  private readonly authService = inject(AuthService);



  findUser(data:Pick<User, 'username'>) {
    return fromProcedure(this.client.user.findUser.query)(data)
  }

  addUser(data:Pick<Contacts, 'user_id' | 'contact_id'>) {
    return fromProcedure(this.client.contact.friendRequest.mutate)(data).pipe(
      tap((response:any) => {
        if(response.status === "SUCCESS"){
          this.authService.getUser();
        }
      })
    )
  }

  acceptUser(data:Pick<Contacts, 'user_id' | 'contact_id'>){
    return fromProcedure(this.client.contact.acceptRequest.mutate)(data).pipe(
      tap((response:any) => {
        if(response.status === "SUCCESS"){
          setTimeout(()=>{this.authService.getUser();},500)
        }
      })
    )
  }

  deleteUser(data:Pick<Contacts, 'user_id' | 'contact_id'>){
    return fromProcedure(this.client.contact.deleteFriend.mutate)(data).pipe(
      tap((response:any) => {
        if(response.status === "SUCCESS"){
          setTimeout(()=>{this.authService.getUser();},500)

        }
      })
    )
  }


}
