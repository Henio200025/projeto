import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css']
})
export class TextareaComponent { @Input() value = ''; }
