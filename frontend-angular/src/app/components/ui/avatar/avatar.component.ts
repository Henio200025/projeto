import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
  @Input() src = '';
  @Input() alt = 'avatar';
}
