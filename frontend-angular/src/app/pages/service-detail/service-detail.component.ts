import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1>Service Details</h1>
      <!-- Add your service detail content here -->
    </div>
  `,
  styles: []
})
export class ServiceDetailComponent {
  constructor(private route: ActivatedRoute) {
    // Get the service ID from route params
    this.route.params.subscribe(params => {
      const serviceId = params['id'];
      // Fetch service details using the ID
    });
  }
}