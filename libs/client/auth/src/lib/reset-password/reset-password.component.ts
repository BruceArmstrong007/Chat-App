import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {CustomValidationService} from '@client/core';
@Component({
  selector: 'chat-app-reset-password',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule,FormsModule,MatButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  resetForm!: FormGroup;
  matchValidator = (control : any) => {
    return this.customValidation.MatchValidator(control,"password",'confirmPassword');
  }


  constructor(private formBuilder : FormBuilder,private customValidation : CustomValidationService){
    this.resetForm = this.formBuilder.group({
      username : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
      password : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])],
      confirmPassword : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])]
    },{
      validators : this.matchValidator
    });
  }

  send(){
    // if(this.resetForm.valid){

    // }
    return
  }

  get f(){
    return (this.resetForm as FormGroup)?.controls;
  }
}
