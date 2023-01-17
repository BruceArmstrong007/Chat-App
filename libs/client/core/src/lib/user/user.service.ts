import { inject, Injectable } from '@angular/core';
import { Contacts, User } from '@prisma/client';
import { map, switchMap, iif, Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { wsClient } from '../client/trpc-client.di';
import { fromProcedure } from '../client/utils';
import { injectClient } from '../core.di';



@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly client = injectClient();
  private readonly authService = inject(AuthService);
  private readonly chatMessage$ = new Subject();

  readonly chat$ = this.chatMessage$.asObservable();


  findUser(data:Pick<User, 'username'>) {
    return fromProcedure(this.client.user.findUser.query)(data)
  }

  addUser(data:Pick<Contacts, 'user_id' | 'contact_id'>) {
    return fromProcedure(this.client.contact.friendRequest.mutate)(data).pipe(
      switchMap((response:any) => iif(() => response.status === 'SUCCESS', this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  acceptUser(data:Pick<Contacts, 'user_id' | 'contact_id'>){
    return fromProcedure(this.client.contact.acceptRequest.mutate)(data).pipe(
      switchMap((response:any) => iif(() => response.status === 'SUCCESS', this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  deleteUser(data:Pick<Contacts, 'user_id' | 'contact_id'>){
    return fromProcedure(this.client.contact.deleteFriend.mutate)(data).pipe(
      switchMap((response:any) => iif(() => response.status === 'SUCCESS', this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  updateProfile(data:any){
    return fromProcedure(this.client.user.updateUser.mutate)(data).pipe(
      switchMap((response:any) => iif(() => response.status === 'SUCCESS', this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  resetPassword(data:any){
    return fromProcedure(this.client.user.resetPassword.mutate)(data).pipe(
      switchMap((response:any) => iif(() => response.status === 'SUCCESS', this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  connectWs(id : any){
      const setMessage = (data: any) =>{
        this.chatMessage$.next(data);
      }
     const subscription = this.client.chats.onChat.subscribe(id,{
      onData(data) {
        // ^ note that `data` here is inferred
      setMessage(data);
      },
      onError(err) {
        console.error('error', err);
      },
      onComplete() {
        subscription.unsubscribe();
      },
    });

    wsClient.close();
  }

  chat(data:any){
    return fromProcedure(this.client.chats.chat.mutate)(data)
  }

  getChats(data:any){
    return fromProcedure(this.client.chats.getChat.query)(data)
  }


  generateRoomID(id1:any,id2:any){
    let id = '';
    if(id1 > id2){
      id = id2.toString()+'-'+id1.toString();
    }else{
      id = id1.toString()+'-'+id2.toString();
    }
    return id;
  }
}
