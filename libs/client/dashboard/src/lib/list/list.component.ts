import { EventEmitter } from '@angular/core';
import { CardComponent } from './../card/card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, Subject } from 'rxjs';

@Component({
  selector: 'chat-app-list',
  standalone: true,
  imports: [CommonModule,MatInputModule,MatIconModule,MatFormFieldModule,FormsModule,CardComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  search!:string;
  textInput$ : any = new Subject();
  _list : any[]  = [];
  @Input() searchText = "Enter your friend's name.";
  @Input() section!: string;
  @Input() set list(value: any[]) {
    this._list = value;
    this.populateList();
  }
  @Output() cardClick : any = new EventEmitter();
  @Output() findFriend : any = new EventEmitter();
  @Output() chatFriend : any = new EventEmitter();
  @Output() cancelRequest : any = new EventEmitter();
  @Output() unfriend : any = new EventEmitter();
  @Output() accept : any = new EventEmitter();
  @Output() addFriend : any = new EventEmitter();



  tempList :any[] = [];

  ngAfterViewInit(){
    this.populateList();
    this.textInput$.pipe(distinctUntilChanged()).subscribe((event:any)=>{
      this.findFriend.emit(this.search);
    });    
  }

  filter(){
    if(this.section === 'Find Friends'){
      this.textInput$.next(this.search);
      return;
    }
    if(this.search){
      this.tempList = this.tempList.filter((data:any)=> data.name.startsWith(this.search) || data.name.includes(this.search))
    }
    else{
      this.populateList();
    }
  }


  populateList(){
    this.tempList = this._list;
  }


}
