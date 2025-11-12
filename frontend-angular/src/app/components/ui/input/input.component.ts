import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  @Input() value = '';
}
