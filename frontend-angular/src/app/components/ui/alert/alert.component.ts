import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent { @Input() message = 'Alert'; }
