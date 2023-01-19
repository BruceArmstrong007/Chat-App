import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { injectClient } from './../client/trpc-client.di';
import { wsClient } from './../client/trpc-client.di';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly client = injectClient();
  private readonly authService = inject(AuthService);
  private readonly notifications$ = new Subject();

  readonly notify$ = this.notifications$.asObservable();


  connectWs(id : any){
    const setMessage = (data: any) =>{
      this.notifications$.next(data);
    }
   const subscription = this.client.notification.userConnect.subscribe(id,{
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

  notification(data : any){
    switch(data?.type){
      case 'notification':
        this.authService.getUser().subscribe((res:any)=> {return;});
        break;
      default:
        break;
    }
  }

}

