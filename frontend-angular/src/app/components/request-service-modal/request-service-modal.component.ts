import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRequestManagementService } from '../../services/service-request-management.service';
import { CreateServiceRequestDTO } from '../../models/service-request.model';

@Component({
  selector: 'app-request-service-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Solicitar Orçamento</h2>
          <button class="btn-close" (click)="close()">&times;</button>
        </div>

        <div class="modal-body">
          <p class="modal-description">
            Descreva o serviço que você precisa para <strong>{{ serviceName }}</strong>. 
            {{ freelancerName }} receberá sua solicitação e enviará um orçamento.
          </p>

          <form (ngSubmit)="submit()">
            <div class="form-group">
              <label for="description">Descrição Detalhada *</label>
              <textarea 
                id="description"
                [(ngModel)]="form().description" 
                name="description"
                required
                rows="8"
                placeholder="Descreva o que você precisa com o máximo de detalhes possível...&#10;&#10;Inclua informações como:&#10;- Objetivos do projeto&#10;- Prazos desejados&#10;- Requisitos específicos&#10;- Orçamento aproximado (se tiver)"
                class="form-textarea"></textarea>
              <small class="form-hint">
                Quanto mais detalhes você fornecer, mais preciso será o orçamento.
              </small>
            </div>

            @if (error()) {
              <div class="error-message">
                {{ error() }}
              </div>
            }

            <div class="form-actions">
              <button type="submit" class="btn-submit" [disabled]="submitting()">
                @if (submitting()) {
                  <span>Enviando...</span>
                } @else {
                  <span>Solicitar Orçamento</span>
                }
              </button>
              <button type="button" class="btn-cancel" (click)="close()">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: white;
      border-radius: 0.75rem;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1f2937;
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 2rem;
      color: #6b7280;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      transition: background 0.2s;
      line-height: 1;
    }

    .btn-close:hover {
      background: #f3f4f6;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-description {
      color: #6b7280;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .modal-description strong {
      color: #7c3aed;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.2s;
      font-family: inherit;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-hint {
      display: block;
      margin-top: 0.375rem;
      color: #6b7280;
      font-size: 0.75rem;
      line-height: 1.4;
    }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .btn-submit,
    .btn-cancel {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-submit {
      background: #7c3aed;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background: #6d28d9;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.3);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-cancel:hover {
      background: #e5e7eb;
    }

    @media (max-width: 640px) {
      .modal-content {
        margin: 0.5rem;
        max-height: calc(100vh - 1rem);
      }

      .form-actions {
        flex-direction: column-reverse;
      }
    }
  `]
})
export class RequestServiceModalComponent {
  @Input() serviceId!: string | number;
  @Input() freelancerId!: string | number;
  @Input() freelancerName: string = 'Freelancer';
  @Input() serviceName: string = 'este serviço';
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() requestCreated = new EventEmitter<void>();

  private requestService = inject(ServiceRequestManagementService);

  form = signal({
    description: ''
  });

  submitting = signal(false);
  error = signal<string | null>(null);

  close() {
    this.closeModal.emit();
  }

  submit() {
    this.error.set(null);

    const formData = this.form();
    
    // Validações
    if (!formData.description.trim()) {
      this.error.set('Por favor, descreva o serviço que você precisa.');
      return;
    }

    if (formData.description.trim().length < 20) {
      this.error.set('A descrição deve ter pelo menos 20 caracteres.');
      return;
    }

    // Validar freelancerId
    if (!this.freelancerId || this.freelancerId === '') {
      this.error.set('Erro: ID do freelancer não encontrado. Tente novamente mais tarde.');
      console.error('FreelancerId inválido:', this.freelancerId);
      return;
    }

    this.submitting.set(true);

    // Converter freelancerId para número
    // Se for string, tentar extrair número ou usar hash
    let freelancerIdNumber: number;
    
    if (typeof this.freelancerId === 'number') {
      freelancerIdNumber = this.freelancerId;
    } else {
      // Se for string como 'u1', 'u2', etc, extrair o número
      const match = String(this.freelancerId).match(/\d+/);
      if (match) {
        freelancerIdNumber = parseInt(match[0]);
      } else {
        // Se não houver número, usar hash simples da string
        freelancerIdNumber = String(this.freelancerId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      }
    }

    const dto: CreateServiceRequestDTO = {
      freelancerId: freelancerIdNumber,
      title: this.serviceName, // Usar o nome do serviço como título
      description: formData.description.trim(),
      serviceId: this.serviceId
    } as any;

    console.log('Enviando requisição:', dto);

    this.requestService.createRequest(dto).subscribe({
      next: () => {
        alert(`✓ Solicitação enviada para ${this.freelancerName}!\n\nAguarde o orçamento. Você será notificado quando o freelancer responder.`);
        this.requestCreated.emit();
        this.close();
      },
      error: (err: any) => {
        console.error('Erro ao criar solicitação:', err);
        const errorMessage = err?.error?.message || err?.message || 'Erro ao enviar solicitação';
        this.error.set(`Erro: ${errorMessage}. Tente novamente.`);
        this.submitting.set(false);
      }
    });
  }
}
