import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRequestManagementService } from '../../services/service-request-management.service';
import { AuthService } from '../../services/auth.service';
import {
  ServiceRequestResponseDTO,
  ServiceRequestStatus,
  ServiceRequestStatusLabels,
  RespondBudgetDTO
} from '../../models/service-request.model';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  private requestService = inject(ServiceRequestManagementService);
  private authService = inject(AuthService);
  
  requests = signal<ServiceRequestResponseDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Para filtros
  selectedStatus = signal<ServiceRequestStatus | 'all'>('all');
  
  // Enums expostos para o template
  readonly StatusEnum = ServiceRequestStatus;
  readonly StatusLabels = ServiceRequestStatusLabels;

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading.set(true);
    this.error.set(null);
    
    const filters = this.selectedStatus() !== 'all' 
      ? { status: [this.selectedStatus() as ServiceRequestStatus] }
      : undefined;

    this.requestService.getMyRequests(filters).subscribe({
      next: (data) => {
        console.log('📥 Requests loaded:', data);
        data.forEach(req => {
          console.log(`Request ${req.id}:`, {
            status: req.status,
            price: req.price,
            canRespond: this.requestService.canRespondBudget(req)
          });
        });
        this.requests.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar pedidos. Tente novamente.');
        this.loading.set(false);
        console.error('Erro:', err);
      }
    });
  }

  filterByStatus(status: ServiceRequestStatus | 'all') {
    this.selectedStatus.set(status);
    this.loadRequests();
  }

  acceptBudget(requestId: string | number) {
    // Verificar se usuário tem telefone cadastrado
    const currentUser = this.authService.currentUserValue;
    const hasPhone = currentUser?.phone && currentUser.phone.trim() !== '';
    
    // BLOQUEAR aceitação se não houver telefone
    if (!hasPhone) {
      alert('❌ Telefone obrigatório!\n\nVocê precisa cadastrar seu número de telefone no perfil antes de aceitar um orçamento.\n\nO freelancer precisa do seu contato para iniciar o trabalho.\n\n👉 Vá em Perfil e adicione seu telefone.');
      return;
    }
    
    const confirmMessage = '✓ Aceitar este orçamento?\n\nO freelancer receberá seu número de telefone para iniciar o contato e combinar os detalhes do trabalho.';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    const response: RespondBudgetDTO = { accept: true };
    
    this.requestService.respondBudget(requestId, response).subscribe({
      next: () => {
        alert('✓ Orçamento aceito com sucesso!\n\nSeu telefone foi compartilhado com o freelancer. Aguarde o contato para combinar os detalhes.');
        this.loadRequests();
      },
      error: (err) => {
        alert('❌ Erro ao aceitar orçamento. Tente novamente.');
        console.error('Erro:', err);
      }
    });
  }

  rejectBudget(requestId: string | number) {
    const message = prompt('✗ Você está rejeitando este orçamento.\n\nDeseja deixar uma mensagem explicando o motivo? (opcional)');
    
    if (message === null) return; // Cancelou

    const response: RespondBudgetDTO = { 
      accept: false,
      message: message || undefined
    };
    
    this.requestService.respondBudget(requestId, response).subscribe({
      next: () => {
        alert('✗ Orçamento rejeitado.\n\nO pedido foi cancelado e o freelancer foi notificado.');
        this.loadRequests();
      },
      error: (err) => {
        alert('❌ Erro ao rejeitar orçamento. Tente novamente.');
        console.error('Erro:', err);
      }
    });
  }

  cancelRequest(requestId: string | number) {
    const reason = prompt('Por que deseja cancelar este pedido? (opcional)');
    
    if (reason === null) return; // Cancelou

    this.requestService.cancelRequest(requestId, reason || undefined).subscribe({
      next: () => {
        alert('Pedido cancelado.');
        this.loadRequests();
      },
      error: (err) => {
        alert('Erro ao cancelar pedido. Tente novamente.');
        console.error('Erro:', err);
      }
    });
  }

  canRespondBudget(request: ServiceRequestResponseDTO): boolean {
    return this.requestService.canRespondBudget(request);
  }

  getStatusClass(status: ServiceRequestStatus): string {
    const classes: Record<ServiceRequestStatus, string> = {
      [ServiceRequestStatus.PENDING_BUDGET]: 'status-pending',
      [ServiceRequestStatus.BUDGETED]: 'status-budgeted',
      [ServiceRequestStatus.ACCEPTED]: 'status-accepted',
      [ServiceRequestStatus.REJECTED]: 'status-rejected',
      [ServiceRequestStatus.IN_PROGRESS]: 'status-progress',
      [ServiceRequestStatus.COMPLETED]: 'status-completed',
      [ServiceRequestStatus.CANCELLED]: 'status-cancelled'
    };
    return classes[status];
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  }
}
