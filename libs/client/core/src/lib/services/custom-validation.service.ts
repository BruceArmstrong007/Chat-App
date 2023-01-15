import { ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {
  value = 'hai';

   MatchValidator(control: any,key1:string,key2:string): ValidationErrors | null {
    if(control.value[key1] !== control.value[key2]){
       control.controls[key2].setErrors({ mismatch: true });
      }
    return null;
  }
}
