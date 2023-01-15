import { UserService, AuthService } from '@client/core';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { ChatComponent } from './../chat/chat.component';
import { ListComponent } from './../list/list.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'chat-app-my-chat',
  standalone: true,
  imports: [CommonModule, ListComponent, ChatComponent],
  templateUrl: './my-chat.component.html',
  styleUrls: ['./my-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyChatComponent {
  sendMessage$: any = new Subject();
  cardClick$: any = new Subject();
  private readonly destroy$ = new Subject<void>();
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly changeDetection = inject(ChangeDetectorRef);


  friendList: any[] = [];


ngAfterViewInit(){
  this.authService.$user.pipe(takeUntil(this.destroy$)).subscribe(((user:any)=>{
     this.friendList = this.contactFilter(user?.contact,'friend');
     console.log(this.friendList,user);

    this.changeDetection.detectChanges();
  }));


  this.cardClick$.pipe(distinctUntilChanged())
    .subscribe((event:any) => {
      console.log(event);
    });

  this.sendMessage$.pipe(distinctUntilChanged())
  .subscribe((event:any) => {
    console.log(event);
  });
  }

  contactFilter(contact:any,key : string){
    contact = contact.filter((contact:any)=>contact.status === key);
    if(contact.length > 0)
      return contact;
    return [];
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
