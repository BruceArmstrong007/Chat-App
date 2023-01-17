import { takeUntil, Subject } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, NotificationService } from '@client/core';

@Component({
  selector: 'chat-app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  private readonly destroy$ : any = new Subject();

  ngOnInit(){
    this.authService.$user.pipe(takeUntil(this.destroy$)).subscribe((user:any)=>{
      this.notificationService.connectWs(user?.id);
    })
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
