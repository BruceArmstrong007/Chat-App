import { Subject, distinctUntilChanged } from 'rxjs';
import { ChatComponent } from './../chat/chat.component';
import { ListComponent } from './../list/list.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  ];


ngAfterViewInit(){
  this.cardClick$.pipe(distinctUntilChanged())
    .subscribe((event:any) => {
      console.log(event);
    });

  this.sendMessage$.pipe(distinctUntilChanged())
  .subscribe((event:any) => {
    console.log(event);
  });
  }

}
