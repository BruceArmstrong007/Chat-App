import { MatIconModule } from '@angular/material/icon';
import {  ToggleService } from '@client/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AuthService } from '@client/core';

@Component({
  selector: 'chat-app-header',
  standalone: true,
  imports: [CommonModule,RouterModule,MatButtonModule,MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isLoggedIn = false;
  @ViewChild('mobileMenu', { read: ElementRef }) mobileMenu!: ElementRef;
  toggle = inject(ToggleService);
  authService = inject(AuthService);
  isMobile!: boolean;
  toggleMenu!:boolean;

  ngAfterViewInit() {
    this.onWindowResize();
  }

  reload(){
    window.location.reload();
  }

  menu(){
    if(this.isMobile){
      this.toggleMenu = !this.toggleMenu;
    }
  }

  switchMode(){
    this.toggle.toggle();
  }

  logout(){
    this.authService.logout();
   }

   @HostListener('window:resize', ['$event'])
   onWindowResize() {
    this.isMobile = window.innerWidth < 768 ? true : false;
    if(!this.isMobile) this.toggleMenu = false;
   }
}
