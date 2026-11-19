import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRequestManagementService } from '../../services/service-request-management.service';
import { SendBudgetDTO } from '../../models/service-request.model';

@Component({
  selector: 'app-budget-proposal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Enviar Contraproposta</h2>
          <button class="btn-close" (click)="close()">&times;</button>
        </div>

        <div class="modal-body">
          <p class="modal-description">
            Ajuste o preço e a descrição da solicitação de <strong>{{ clientName }}</strong>. 
            O cliente receberá sua contraproposta e poderá aceitar ou fazer nova solicitação.
          </p>

          <form (ngSubmit)="submit()">
            <div class="form-group">
              <label for="price">Preço Proposto (R$) *</label>
              <input 
                id="price"
                type="number"
                step="0.01"
                min="0"
                [(ngModel)]="form().price"
                name="price"
                required
                class="form-input"
                placeholder="Ex: 350.00" />
              <small class="form-hint">
                Valor que você propõe para executar este trabalho
              </small>
            </div>

            <div class="form-group">
              <label for="description">Descrição/Observações *</label>
              <textarea 
                id="description"
                [(ngModel)]="form().description" 
                name="description"
                required
                rows="6"
                placeholder="Descreva como você pretende executar o trabalho...&#10;&#10;Inclua:&#10;- Abordagem do projeto&#10;- Prazos estimados&#10;- Detalhes do serviço&#10;- Qualquer observação importante"
                class="form-textarea"></textarea>
              <small class="form-hint">
                Seja claro e detalhado para que o cliente compreenda sua proposta
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
                  <span>Enviar Contraproposta</span>
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
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }

    .form-hint {
      display: block;
      margin-top: 0.375rem;
      font-size: 0.8125rem;
      color: #9ca3af;
      line-height: 1.4;
    }

    .error-message {
      background: #fee2e2;
      color: #991b1b;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      border-left: 4px solid #dc2626;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .form-actions button {
      flex: 1;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-submit {
      background: #10b981;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
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
export class BudgetProposalModalComponent {
  @Input() serviceId!: string | number;
  @Input() clientName: string = 'Cliente';
  @Input() initialPrice: number = 0;
  @Input() initialDescription: string = '';
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() proposalSent = new EventEmitter<void>();

  private requestService = inject(ServiceRequestManagementService);

  form = signal({
    price: 0 as number | null,
    description: ''
  });

  submitting = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.form.set({
      price: this.initialPrice || null,
      description: this.initialDescription
    });
  }

  close() {
    this.closeModal.emit();
  }

  submit() {
    this.error.set(null);

    const formData = this.form();
    
    // Validações
    const priceNumber = Number(formData.price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      this.error.set('Informe um preço válido (zero ou maior).');
      return;
    }

    if (!formData.description.trim()) {
      this.error.set('Descreva como você pretende executar este trabalho.');
      return;
    }

    if (formData.description.trim().length < 20) {
      this.error.set('A descrição deve ter pelo menos 20 caracteres.');
      return;
    }

    this.submitting.set(true);

    const payload: SendBudgetDTO = {
      price: priceNumber,
      description: formData.description.trim()
    };

    console.log('Enviando contraproposta:', { serviceId: this.serviceId, payload });

    this.requestService.sendBudget(this.serviceId, payload).subscribe({
      next: () => {
        this.submitting.set(false);
        alert(`✓ Contraproposta enviada para ${this.clientName}!`);
        this.proposalSent.emit();
        this.close();
      },
      error: (err: any) => {
        console.error('Erro completo ao enviar contraproposta:', err);
        this.submitting.set(false);
        
        // Extrair mensagem de erro
        let errorMessage = 'Erro ao enviar contraproposta';
        
        if (err?.error?.message) {
          errorMessage = err.error.message;
        } else if (err?.error?.error) {
          errorMessage = err.error.error;
        } else if (err?.message) {
          errorMessage = err.message;
        } else if (err?.status) {
          errorMessage = `Erro ${err.status}: ${err.statusText || 'Erro desconhecido'}`;
        }
        
        this.error.set(`Erro: ${errorMessage}. Tente novamente.`);
      }
    });
  }
}
