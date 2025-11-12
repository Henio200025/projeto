import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-label',
  standalone: true,
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent {
  @Input() text = '';
}
