import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, PromptHandlerService, UserService, RequestHandlerService } from '@client/core';
import { Subject, distinctUntilChanged, takeUntil,  map } from 'rxjs';
import { ListComponent } from './../list/list.component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'chat-app-find-friend',
  standalone: true,
  imports: [CommonModule,ListComponent,MatDialogModule],
  providers:[PromptHandlerService],
  templateUrl: './find-friend.component.html',
  styleUrls: ['./find-friend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindFriendComponent {
  friendList: any[] = [];
  addRequest$ : any = new Subject();
  findFriend$ : any = new Subject();
  changeDetection = inject(ChangeDetectorRef);
  cancelRequest$ : any = new Subject();
  private readonly requestHandler = inject(RequestHandlerService);
  private readonly destroy$ = new Subject<void>();
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly prompt = inject(PromptHandlerService);


  ngAfterViewInit(){
    this.addRequest$.subscribe((event:any)=>{
      this.prompt.openDialog({title : 'Confirmation',description:'Do you want send request ?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(result && contact_id){
         this.userService.addUser({contact_id : event.id,user_id : contact_id})
         .pipe(takeUntil(this.destroy$))
         .subscribe({
        next: (data:any) => {
          const {message,options} = this.requestHandler.SuccessResponseHandler(data?.message,data?.status);
          this.snackBar.open(message,'Close',options);

         this.friendList = this.friendList.map((user:any)=>{
            if(user.id === event.id){
              return {
                ...user,
                requested : true
              }
            }
            return user;
          });
          this.changeDetection.detectChanges();
        },
        error: (err:any) => {
          console.log({ err });
        },
      });
        }
      });

    });


    this.cancelRequest$.subscribe((event:any)=>{
      this.prompt.openDialog({title : 'Confirmation',description:'Do you want to cancel request ?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(result && contact_id){
         this.userService.deleteUser({contact_id : event.id,user_id : contact_id})
         .pipe(takeUntil(this.destroy$))
         .subscribe({
        next: (data:any) => {
          const {message,options} = this.requestHandler.SuccessResponseHandler(data?.message,data?.status);
          this.snackBar.open(message,'Close',options);

         this.friendList = this.friendList.map((user:any)=>{
          if(user.id === event.id){
            return {
              ...user,
              requested : false
            }
          }
          return user;
        });
        this.changeDetection.detectChanges();
        },
        error: (err:any) => {
          console.log({ err });
        },
      });
        }
      });

    });

    this.findFriend$.pipe(distinctUntilChanged()).subscribe((event:any)=>{
      if(!event){
        this.friendList = [];
        return;
      }
      this.userService.findUser({username : event}).pipe(takeUntil(this.destroy$),

      map((userList:any)=> {
        const currentUser : any = this.authService.currentUser();

        // remove current user
        userList = userList.filter((user:any)=> user.id !== currentUser?.id);

        //
        userList = userList.map((user:any)=>{
          if(currentUser.contact.find((elt : any)=> elt.id === user.id)){

            return {
              ...user,
              requested : true
            }
          }
          return user;
        });
        return userList;
      }))
      .subscribe({
        next: (data:any) => {
            this.friendList = data;
        },
        error: (err:any) => {
          console.log(err);
        },
      });
    });
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}




