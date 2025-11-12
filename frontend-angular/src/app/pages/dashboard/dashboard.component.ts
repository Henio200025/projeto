import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1>Dashboard</h1>
      <!-- Add your dashboard content here -->
    </div>
  `,
  styles: []
})
export class DashboardComponent {}