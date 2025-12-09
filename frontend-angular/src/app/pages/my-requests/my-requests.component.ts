import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRequestManagementService } from '../../services/service-request-management.service';
import { AuthService } from '../../services/auth.service';
import { AcceptBudgetModalComponent } from '../../components/accept-budget-modal/accept-budget-modal.component';
import {
  ServiceRequestResponseDTO,
  ServiceRequestStatus,
  ServiceRequestStatusLabels,
  RespondBudgetDTO,
  PhoneOption
} from '../../models/service-request.model';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, AcceptBudgetModalComponent],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  private requestService = inject(ServiceRequestManagementService);
  private authService = inject(AuthService);
  
  requests = signal<ServiceRequestResponseDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  userPhones = signal<PhoneOption[]>([]);
  
  // Para filtros
  selectedStatus = signal<ServiceRequestStatus | 'all'>('all');
  
  // Para modal de aceitar orçamento
  showAcceptModal = signal(false);
  selectedRequestForAccept = signal<ServiceRequestResponseDTO | null>(null);
  
  // Enums expostos para o template
  readonly StatusEnum = ServiceRequestStatus;
  readonly StatusLabels = ServiceRequestStatusLabels;

  constructor() {
    // Quando a modal é aberta, recarrega os telefones do usuário do servidor
    effect(() => {
      if (this.showAcceptModal()) {
        this.authService.refreshCurrentUser().subscribe(() => {
          this.loadUserPhones();
        });
      }
    });
  }

  ngOnInit() {
    this.loadUserPhones();
    this.loadRequests();
  }

  loadUserPhones() {
    this.authService.currentUser$.subscribe(user => {
      if (user && user.phones && Array.isArray(user.phones)) {
        // Converter PhoneDTO para PhoneOption
        const phones: PhoneOption[] = user.phones.map(p => ({
          id: p.id || '',
          number: p.number,
          description: p.description,
          isWhatsApp: p.isWhatsApp || false
        }));
        this.userPhones.set(phones);
      } else {
        this.userPhones.set([]);
      }
    });
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

  acceptBudget(request: ServiceRequestResponseDTO) {
    this.selectedRequestForAccept.set(request);
    this.showAcceptModal.set(true);
  }

  closeAcceptModal() {
    this.showAcceptModal.set(false);
    this.selectedRequestForAccept.set(null);
  }

  onBudgetAccepted() {
    this.closeAcceptModal();
    this.loadRequests();
  }

  rejectBudget(requestId: string | number) {
    const response: RespondBudgetDTO = { 
      accept: false
    };
    
    this.requestService.respondBudget(requestId, response).subscribe({
      next: () => {
        alert('✗ Pedido cancelado.');
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
      [ServiceRequestStatus.PENDING]: 'status-pending',
      [ServiceRequestStatus.WAITING_USER]: 'status-budgeted',
      [ServiceRequestStatus.CONFIRMED]: 'status-accepted',
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

  getStatusLabel(status: any): string {
    return ServiceRequestStatusLabels[status as ServiceRequestStatus] || status;
  }
}
