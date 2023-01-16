import { UserService, AuthService } from '@client/core';
import { Location } from '@angular/common';
import { Subject,  takeUntil } from 'rxjs';
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
  contactUser:any;
  messageList : any = [];
  private readonly destroy$ = new Subject<void>();
  private readonly userService = inject(UserService);
   readonly authService = inject(AuthService);
   private readonly location = inject(Location);
  private readonly changeDetection = inject(ChangeDetectorRef);


  friendList: any[] = [];


ngAfterViewInit(){
  this.contactUser = this.location.getState();
  if(this.contactUser?.id){
    this.startChat(this.contactUser);
  }else{
    this.contactUser = undefined;
  }
  this.userService.chat$.pipe(takeUntil(this.destroy$)).subscribe((message:any)=>{
        this.messageList = [...this.messageList, message];
        console.log(message,this.messageList)
        this.changeDetection.detectChanges();
  });

  this.authService.$user.pipe(takeUntil(this.destroy$)).subscribe((user:any)=>{
     this.friendList = this.contactFilter(user?.contact,'friend');
    this.changeDetection.detectChanges();
  });


  this.cardClick$
    .subscribe(this.startChat.bind(this));

  this.sendMessage$
  .subscribe((event:any) => {
    const user_id = this.authService.currentUser()?.id;
    const contact_id = this.contactUser?.id;
    const id = this.userService.generateRoomID(user_id,contact_id);
    const data = {
      ...event,
      id,
      from : user_id,
      to : contact_id
    };

    this.userService.chat(data).subscribe((res:any)=>{return})
  });
  }

  startChat(contactUser:any)  {
    this.contactUser = contactUser;
    this.messageList = [];
    console.log(this.authService)
    const user_id = this.authService.currentUser()?.id;

    const contact_id = this.contactUser?.id;
    console.log(contact_id,user_id);
    // generate room id to create room
    this.userService.getChats({user_id,contact_id}).subscribe((res:any)=>{
      this.messageList = res;
      this.changeDetection.detectChanges();
    });
    this.userService.connectWs(this.userService.generateRoomID(user_id,contact_id));
  }

  contactFilter(contact:any,key : string){
    if(!contact || contact.length == 0){
      return [];
    }
     contact = contact.filter((contact:any)=>contact.status === key);
     return contact;
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
