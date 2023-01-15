import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, UserService } from '@client/core';
import { Subject, distinctUntilChanged, takeUntil,  map } from 'rxjs';
import { ListComponent } from './../list/list.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'chat-app-find-friend',
  standalone: true,
  imports: [CommonModule,ListComponent],
  templateUrl: './find-friend.component.html',
  styleUrls: ['./find-friend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindFriendComponent {
  friendList: any[] = [];
  addFriend$ : any = new Subject();
  findFriend$ : any = new Subject();
  private readonly destroy$ = new Subject<void>();
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  snackBar = inject(MatSnackBar);


  ngAfterViewInit(){
    this.addFriend$.pipe(distinctUntilChanged()).subscribe((event:any)=>{
      console.log(event);

    });

    this.findFriend$.pipe(distinctUntilChanged()).subscribe((event:any)=>{
      if(!event){
        this.friendList = [];
        return;
      }
      this.userService.findUser({username : event}).pipe(map((userList:any)=> userList.filter((user:any)=> user.id != this.authService.currentUser())),takeUntil(this.destroy$))
      .subscribe({
        next: (data:any) => {;
         this.friendList = data;
        },
        error: (err:any) => {
          console.log({ err });
        },
      });
    });
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}




