import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent { @Input() message = ''; }
