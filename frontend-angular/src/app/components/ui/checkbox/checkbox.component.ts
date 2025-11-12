import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent {
  @Input() checked = false;
}
