import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1>Criar Serviço</h1>
      <!-- Adicione aqui o conteúdo da página de criação de serviço -->
    </div>
  `,
  styles: []
})
export class CreateServiceComponent {}