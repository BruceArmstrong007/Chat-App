import { PromptComponent } from '@client/shared';
import { inject, Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class PromptHandlerService {
  dialog = inject(MatDialog);

  openDialog(data:any){
    const dialogRef = this.dialog.open(PromptComponent, {
      width: '500px',
      data:data,
    });
    return dialogRef.afterClosed();
  }
}
