import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1>Explorar Serviços</h1>
      <!-- Adicione aqui o conteúdo da página de exploração de serviços -->
    </div>
  `,
  styles: []
})
export class BrowseServicesComponent {}