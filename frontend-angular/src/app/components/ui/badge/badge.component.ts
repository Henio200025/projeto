import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css']
})
export class BadgeComponent {
  @Input() text = '';
}
