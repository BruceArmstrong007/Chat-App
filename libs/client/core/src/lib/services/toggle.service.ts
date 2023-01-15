import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
   darkmode = false;

    toggle(){
      this.darkmode = !this.darkmode;
    }

}
