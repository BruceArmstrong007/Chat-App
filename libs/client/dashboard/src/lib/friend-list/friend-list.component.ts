import { Subject, distinctUntilChanged } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { ListComponent } from './../list/list.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptHandlerService } from '@client/core';

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

  prompt = inject(PromptHandlerService);
  unfriend$ = new Subject();
  chatFriend$ = new Subject();
  cancelRequest$ = new Subject();
  accept$ = new Subject();

  friendList: any[] = [
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
    {
      name: "card name",
      image: "./assets/images/default.png"
    },
  ];

ngAfterViewInit(){
    this.unfriend$.pipe(distinctUntilChanged())
      .subscribe((event:any) => {
        this.prompt.openDialog({title : 'Confirmation',description:'Do you want to unfriend ?'}).subscribe((result:any)=>{
          if(result){
            console.log(event)
          }
        });
      });

      
    this.accept$.pipe(distinctUntilChanged()).subscribe((event:any)=>{
      console.log(event);
      
    });

    this.chatFriend$.pipe(distinctUntilChanged()).subscribe((event:any)=>{
      console.log(event);
      
    });

    this.cancelRequest$.pipe(distinctUntilChanged()).subscribe((event:any)=>{
      console.log(event);
      
    });
    
  }


}
