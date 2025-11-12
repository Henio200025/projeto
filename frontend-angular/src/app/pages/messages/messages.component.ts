import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1>Messages</h1>
      <!-- Add your messages content here -->
    </div>
  `,
  styles: []
})
export class MessagesComponent {}