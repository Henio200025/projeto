import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() label = 'Button';
}
