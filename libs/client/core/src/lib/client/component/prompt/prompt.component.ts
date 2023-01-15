import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Component,Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'chat-app-prompt',
  standalone: true,
  imports: [CommonModule,MatDialogModule],
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
})
export class PromptComponent {
  
  constructor(public dialogRef: MatDialogRef<PromptComponent>,@Inject(MAT_DIALOG_DATA) public data:any) { }

}
