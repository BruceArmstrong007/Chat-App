import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Subject, takeUntil, tap, BehaviorSubject } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { ListComponent } from './../list/list.component';
import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptHandlerService, AuthService, UserService, RequestHandlerService } from '@client/core';

@Component({
  selector: 'chat-app-friend-list',
  standalone: true,
  imports: [CommonModule,ListComponent,MatDialogModule],
  templateUrl: './friend-list.component.html',
  providers:[PromptHandlerService],
  styleUrls: ['./friend-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendListComponent {

  chatFriend$ = new Subject();
  cancelRequest$ = new Subject();
  acceptRequest$ = new Subject();

  friendList: any[] = [];
  sentList: any[] = [];
  receivedList: any[] = [];
  private readonly requestHandler = inject(RequestHandlerService);
  private readonly destroy$ = new Subject<void>();
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly changeDetection = inject(ChangeDetectorRef);
  private readonly snackBar = inject(MatSnackBar);
  private readonly prompt = inject(PromptHandlerService);



ngAfterViewInit(){
    this.authService.$user.pipe(takeUntil(this.destroy$)).subscribe(((user:any)=>{
      this.sentList = this.contactFilter(user?.contact,'sent');
      this.friendList = this.contactFilter(user?.contact,'friend');
      this.receivedList = this.contactFilter(user?.contact,'received');
      this.changeDetection.detectChanges();
    }));


    this.acceptRequest$.subscribe((event:any)=>{
      this.prompt.openDialog({title : 'Confirmation',description:'Do you want to accept friend request ?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(result && contact_id){
         this.userService.acceptUser({contact_id : event.id,user_id : contact_id})
         .pipe(takeUntil(this.destroy$))
         .subscribe({
        next: (data:any) => {
          const {message,options} = this.requestHandler.SuccessResponseHandler(data?.message,data?.status);
          this.snackBar.open(message,'Close',options);
        },
        error: (err:any) => {
          console.log({ err });
        },
        });
        }
      });

    });

    this.chatFriend$.subscribe((event:any)=>{
      console.log(event);

    });

    this.cancelRequest$.subscribe((eventData:any)=>{
      const event = eventData?.event;
      this.prompt.openDialog({title : 'Confirmation',description:'Do you want to cancel request ?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(result && contact_id){
         this.userService.deleteUser({contact_id : event.id,user_id : contact_id})
         .pipe(takeUntil(this.destroy$))
         .subscribe({
        next: (data:any) => {
          const {message,options} = this.requestHandler.SuccessResponseHandler(data?.message,data?.status);
          this.snackBar.open(message,'Close',options);
        },
        error: (err:any) => {
          console.log({ err });
        },
      });
        }
      });
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
