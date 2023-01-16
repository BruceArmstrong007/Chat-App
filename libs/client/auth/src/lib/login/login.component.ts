import { RequestHandlerService } from '@client/core';
import { Router } from '@angular/router';
import { AuthService } from '@client/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Subject,takeUntil } from 'rxjs';
@Component({
  selector: 'chat-app-login',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule,FormsModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  formBuilder = inject(FormBuilder);
  requestHandler = inject(RequestHandlerService);
  hide = true;
  loginForm: FormGroup = this.formBuilder.group({
    username : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
    password : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(32)])]
  });
  snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  send(){
    if(!this.loginForm.valid){
      return;
    }
    const formValue = this.loginForm.getRawValue();

    this.authService
      .login({ username: formValue.username, password: formValue.password })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data:any) => {
          console.log(data)
          if(data?.id){
            this.router.navigateByUrl('/user');
            return;
          }
          const {message,options} = this.requestHandler.SuccessResponseHandler(data?.message,data?.status);
          this.snackBar.open(message,'Close',options);
        },
        error: err => {
          console.log(err);

        },
      });
  }

  get f(){
    return (this.loginForm as FormGroup)?.controls;
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
