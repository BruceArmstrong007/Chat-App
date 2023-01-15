import { Subject } from 'rxjs';
import { PromptComponent } from './../client/component/prompt/prompt.component';
import { inject, Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class PromptHandlerService {
  dialog = inject(MatDialog);

  openDialog(data:any){
    const dialogRef = this.dialog.open(PromptComponent, {
      width: '250px',
      data:data,
    });
    return dialogRef.afterClosed();
  }
}
