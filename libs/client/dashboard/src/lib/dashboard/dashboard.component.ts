import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'chat-app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  constructor(private route: ActivatedRoute){

  }

  ngOnInit(){
    
    console.log(this.route.snapshot.data);
  }
}
