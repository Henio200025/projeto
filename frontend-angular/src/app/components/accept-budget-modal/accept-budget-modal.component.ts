import { Component, Input, Output, EventEmitter, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRequestManagementService } from '../../services/service-request-management.service';
import { RespondBudgetDTO, PhoneOption } from '../../models/service-request.model';

@Component({
  selector: 'app-accept-budget-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Confirmar Aceitação do Orçamento</h2>
          <button class="btn-close" (click)="close()">&times;</button>
        </div>

        <div class="modal-body">
          <p class="modal-description">
            Você está aceitando o orçamento de <strong>{{ freelancerName }}</strong>. 
            Para que o freelancer possa entrar em contato com você, selecione um de seus telefones cadastrados.
          </p>

          <div class="budget-summary">
            <div class="summary-item">
              <span class="label">Valor do Orçamento:</span>
              <span class="value price">{{ formatPrice(budgetPrice) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Descrição:</span>
              <p class="notes">{{ budgetDescription }}</p>
            </div>
          </div>

          <form (ngSubmit)="submit()">
            <div class="form-group">
              <label for="phone">Selecione um Telefone *</label>
              
              @if (userPhones.length === 0) {
                <div class="no-phones-warning">
                  <p>⚠️ Você ainda não tem nenhum telefone cadastrado.</p>
                  <a href="/profile" class="link-profile">Ir para Perfil e Adicionar</a>
                </div>
              } @else {
                <select 
                  id="phone"
                  [(ngModel)]="form().phoneId"
                  name="phoneId"
                  required
                  class="form-select">
                  <option value="" disabled selected>Escolha um telefone...</option>
                  @for (phone of userPhones; track phone.id) {
                    <option [value]="phone.id">
                      {{ phone.number }} - {{ phone.description }}
                      @if (phone.isWhatsApp) {
                        (WhatsApp)
                      }
                    </option>
                  }
                </select>
              }
              
              <small class="form-hint">
                O freelancer usará o telefone selecionado para entrar em contato
              </small>
            </div>

            @if (error()) {
              <div class="error-message">
                {{ error() }}
              </div>
            }

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-submit" 
                [disabled]="submitting() || userPhones.length === 0">
                @if (submitting()) {
                  <span>Confirmando...</span>
                } @else {
                  <span>Confirmar Aceitação</span>
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
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-content { background: white; border-radius: 0.75rem; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e5e7eb; }
    .modal-header h2 { font-size: 1.5rem; font-weight: bold; color: #1f2937; margin: 0; }
    .btn-close { background: none; border: none; font-size: 2rem; color: #6b7280; cursor: pointer; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem; transition: background 0.2s; line-height: 1; }
    .btn-close:hover { background: #f3f4f6; }
    .modal-body { padding: 1.5rem; }
    .modal-description { color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6; }
    .modal-description strong { color: #7c3aed; font-weight: 600; }
    .budget-summary { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1.5rem; }
    .summary-item { margin-bottom: 0.75rem; }
    .summary-item:last-child { margin-bottom: 0; }
    .summary-item .label { display: block; font-weight: 600; color: #374151; font-size: 0.875rem; margin-bottom: 0.25rem; }
    .summary-item .price { font-size: 1.25rem; color: #10b981; font-weight: 600; }
    .summary-item .notes { color: #6b7280; margin: 0; font-size: 0.875rem; line-height: 1.4; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; font-size: 0.875rem; }
    .form-select { width: 100%; padding: 0.625rem 0.875rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s; background-color: white; cursor: pointer; }
    .form-select:focus { outline: none; border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1); }
    .form-select:disabled { background-color: #f3f4f6; cursor: not-allowed; opacity: 0.6; }
    .form-hint { display: block; margin-top: 0.375rem; font-size: 0.8125rem; color: #9ca3af; line-height: 1.4; }
    .no-phones-warning { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem; text-align: center; }
    .no-phones-warning p { color: #92400e; margin: 0 0 0.75rem 0; font-weight: 500; }
    .link-profile { display: inline-block; background: #7c3aed; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; text-decoration: none; font-weight: 600; transition: background 0.2s; }
    .link-profile:hover { background: #6d28d9; }
    .error-message { background: #fee2e2; color: #991b1b; padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1rem; font-size: 0.875rem; border-left: 4px solid #dc2626; }
    .form-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .form-actions button { flex: 1; padding: 0.75rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-submit { background: #10b981; color: white; }
    .btn-submit:hover:not(:disabled) { background: #059669; transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-cancel { background: #f3f4f6; color: #374151; }
    .btn-cancel:hover { background: #e5e7eb; }
    @media (max-width: 640px) { .modal-content { margin: 0.5rem; max-height: calc(100vh - 1rem); } .form-actions { flex-direction: column-reverse; } }
  `]
})
export class AcceptBudgetModalComponent implements OnInit {
  @Input() requestId!: string | number;
  @Input() freelancerName: string = 'Freelancer';
  @Input() budgetPrice: number = 0;
  @Input() budgetDescription: string = '';
  @Input() userPhones: PhoneOption[] = [];
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() budgetAccepted = new EventEmitter<void>();

  private requestService = inject(ServiceRequestManagementService);

  form = signal({
    phoneId: ''
  });

  submitting = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    if (this.userPhones.length === 1) {
      this.form.set({ phoneId: String(this.userPhones[0].id) });
    }
  }

  close() {
    this.closeModal.emit();
  }

  submit() {
    this.error.set(null);

    const phoneId = this.form().phoneId;
    
    if (!phoneId) {
      this.error.set('Selecione um telefone para prosseguir');
      return;
    }

    const selectedPhone = this.userPhones.find(p => String(p.id) === phoneId);
    if (!selectedPhone) {
      this.error.set('Telefone inválido. Selecione novamente.');
      return;
    }

    this.submitting.set(true);

    const response: RespondBudgetDTO = {
      accept: true,
      phone: selectedPhone.number.replace(/\D/g, '')
    };

    this.requestService.respondBudget(this.requestId, response).subscribe({
      next: () => {
        this.submitting.set(false);
        alert(`Orçamento aceito! Seu telefone ${selectedPhone.number} foi enviado para ${this.freelancerName}`);
        this.budgetAccepted.emit();
        this.close();
      },
      error: (err: any) => {
        console.error('Erro ao aceitar orçamento:', err);
        this.submitting.set(false);
        const errorMessage = err?.error?.message || err?.message || 'Erro ao aceitar orçamento';
        this.error.set(`Erro: ${errorMessage}. Tente novamente.`);
      }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  }
}
