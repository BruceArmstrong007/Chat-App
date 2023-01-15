import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'chat-app-card',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() card: any;
  @Input() message!: any;
  @Input() section!:string;
  @Output() cardClick : any = new EventEmitter();
  @Output() chatFriend : any = new EventEmitter();
  @Output() cancelRequest : any = new EventEmitter();
  @Output() unfriend : any = new EventEmitter();
  @Output() acceptRequest : any = new EventEmitter();
  @Output() addFriend : any = new EventEmitter();



}
