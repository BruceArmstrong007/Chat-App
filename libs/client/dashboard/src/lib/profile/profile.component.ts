import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, UserService } from '@client/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {CustomValidationService, RequestHandlerService} from '@client/core';
@Component({
  selector: 'chat-app-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule,FormsModule,MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly customValidation = inject(CustomValidationService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly destroy$: any = new Subject();
  private readonly snackBar = inject(MatSnackBar);
  private readonly requestHandler = inject(RequestHandlerService);
  private readonly router = inject(Router);
  profileForm!: FormGroup;
  matchValidator = (control : any) => {
    return this.customValidation.MatchValidator(control,"password",'confirmPassword');
  }


  constructor(){
    this.profileForm = this.formBuilder.group({
      id : [Validators.required],
      username : ['',Validators.compose([Validators.required,Validators.minLength(8),Validators.maxLength(15)])],
      image : ['',Validators.compose([])],
    },{
      validators : this.matchValidator
    });
  }

  ngOnInit(){
    this.authService.$user.pipe(takeUntil(this.destroy$)).subscribe((user:any)=>{
      this.profileForm.patchValue({
        id : user?.id,
        image : user?.image,
        username : user?.username
      });
    })
  }


  get f(){
    return (this.profileForm as FormGroup)?.controls;
  }

  send(){
    if(!this.profileForm.valid){
      return;
    }
      this.userService.updateProfile(this.profileForm.getRawValue())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data:any) => {
          const {message,options} = this.requestHandler.SuccessResponseHandler(data?.message,data?.status);
          this.snackBar.open(message,'Close',options);
        },
        error: (err:any) => {
          console.log(err);
        },
      });
  }


  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
