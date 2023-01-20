import { takeUntil, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import {  NotificationService, ToggleService } from '@client/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@client/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'chat-app-header',
  standalone: true,
  imports: [CommonModule,RouterModule,MatButtonModule,MatIconModule,MatMenuModule,MatBadgeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isLoggedIn = false;
  badgeHidden = true;
  notifications : any = [];
  @ViewChild('mobileMenu', { read: ElementRef }) mobileMenu!: ElementRef;
  private readonly destroy$ : any = new Subject();
  private readonly notificationService = inject(NotificationService);

  toggle = inject(ToggleService);
  readonly authService = inject(AuthService);
  isMobile!: boolean;
  toggleMenu!:boolean;
  user : any;

  ngAfterViewInit() {
    this.onWindowResize();
    this.authService.$user.pipe(takeUntil(this.destroy$)).subscribe((user:any)=>{
      this.user = user;
    });

    this.notificationService.notify$.pipe(takeUntil(this.destroy$)).subscribe((notification:any)=>{
      this.notificationService.notification(notification);
      if(notification?.category === 'accepted' || notification?.category === 'received'){
        this.notifications = [...this.notifications,notification];
        this.badgeHidden = false;
      }
    });
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

   hideBadge(){
    this.badgeHidden = true;
   }

   @HostListener('window:resize', ['$event'])
   onWindowResize() {
    this.isMobile = window.innerWidth < 768 ? true : false;
    if(!this.isMobile) this.toggleMenu = false;
   }
}
