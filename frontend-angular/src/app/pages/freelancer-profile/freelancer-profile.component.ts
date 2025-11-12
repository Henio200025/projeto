import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1>Freelancer Profile</h1>
      <!-- Add your freelancer profile content here -->
    </div>
  `,
  styles: []
})
export class FreelancerProfileComponent {
  constructor(private route: ActivatedRoute) {
    // Get the freelancer ID from route params
    this.route.params.subscribe(params => {
      const freelancerId = params['id'];
      // Fetch freelancer details using the ID
    });
  }
}