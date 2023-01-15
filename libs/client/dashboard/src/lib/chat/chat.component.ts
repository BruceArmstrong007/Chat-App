import { Observable, Subject,filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component, inject, ViewChild, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleService } from '@client/core';
import  {  NgxEmojModule  }  from  'ngx-emoj';
import {MatMenu, MatMenuModule} from '@angular/material/menu';
@Component({
  selector: 'chat-app-chat',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,MatIconModule,FormsModule,MatMenuModule,MatButtonModule,NgxEmojModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  messageText = 'Enter something to say..';
  message = '';
  pickerIsOpened =  false;
  toggle = inject(ToggleService);
  @Output() sendMessage : any = new EventEmitter();
  @ViewChild('menu') pickerMenu!: MatMenu;
  send(){
    this.sendMessage.emit(this.message);
    this.message = '';
  }

  togglePicker(){
    this.pickerIsOpened = !this.pickerIsOpened
    return
  }

  handleEmoji(event : any){
    this.message += event.char;
  }


  ngAfterViewInit() {
    // Inject our custom logic of menu close
    (this.pickerMenu as any).closed = this.configureMenuClose(this.pickerMenu.close);
  }

  private configureMenuClose(old: MatMenu['close']): MatMenu['close'] {
    const upd = new EventEmitter();
    this.feed(upd.pipe(
      filter((event:any) => {
        if (event === 'click') {
          // Ignore clicks inside the menu
          return false;
        }
        return true;
      }),
    ), old);
    return upd;
  }

  feed<T>(from: Observable<T>, to: Subject<T>): any {
    return from.subscribe(
      (data:any) => to.next(data),
      (err:any) => to.error(err),
      () => to.complete(),
    );
  }
}

