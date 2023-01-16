import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, RequestHandlerService } from '@client/core';
import { takeUntil, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { CustomValidationService, fromProcedure, injectClient } from '@client/core';
@Component({
  selector: 'chat-app-register',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule,FormsModule,MatButtonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  registerForm: FormGroup;
  snackBar = inject(MatSnackBar);
  requestHandler = inject(RequestHandlerService);
  formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly customValidation = inject(CustomValidationService);
  private readonly destroy$ = new Subject<void>();
  private readonly client = injectClient();
  hide = true;
  confirmHide = true;
  matchValidator = (control : any) => {
    return this.customValidation.MatchValidator(control,"password",'confirmPassword');
  }

  constructor(){
   this.registerForm = this.formBuilder.group({
      username : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
      password : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])],
      confirmPassword : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])]
    },{
      validators : this.matchValidator
    });
  }

  send(){
    if(!this.registerForm.valid){
      return;
    }
      this.authService.register(this.registerForm.getRawValue())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data:any) => {
          const {message,options} = this.requestHandler.SuccessResponseHandler(data?.message,data?.status);
          this.snackBar.open(message,'Close',options);
          this.router.navigateByUrl('/');
        },
        error: (err:any) => {
          console.log(err);
        },
      });
  }

  get f(){
    return (this.registerForm as FormGroup)?.controls;
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
