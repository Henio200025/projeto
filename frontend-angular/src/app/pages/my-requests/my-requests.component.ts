import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRequestManagementService } from '../../services/service-request-management.service';
import { AuthService } from '../../services/auth.service';
import { RatingService } from '../../services/rating.service';
import { AcceptBudgetModalComponent } from '../../components/accept-budget-modal/accept-budget-modal.component';
import { RatingModalComponent } from '../../components/rating-modal/rating-modal.component';
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
  imports: [CommonModule, AcceptBudgetModalComponent, RatingModalComponent],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  private requestService = inject(ServiceRequestManagementService);
  private authService = inject(AuthService);
  private ratingService = inject(RatingService);
  
  requests = signal<ServiceRequestResponseDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  userPhones = signal<PhoneOption[]>([]);
  
  // Para filtros
  selectedStatus = signal<ServiceRequestStatus | 'all'>('all');
  
  // Para modal de aceitar orçamento
  showAcceptModal = signal(false);
  selectedRequestForAccept = signal<ServiceRequestResponseDTO | null>(null);
  
  // Para modal de avaliação
  showRatingModal = signal(false);
  selectedRequestForRating = signal<ServiceRequestResponseDTO | null>(null);
  ratedServiceIds = signal<Set<number>>(new Set());
  
  // Enums expostos para o template
  readonly StatusEnum = ServiceRequestStatus;
  readonly StatusLabels = ServiceRequestStatusLabels;
  private readonly RATED_SERVICES_KEY = 'rated_service_ids';

  constructor() {
    // Carregar IDs de serviços já avaliados do localStorage
    this.loadRatedServicesFromStorage();
    
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
    // Sincronizar avaliações do backend antes de carregar pedidos
    this.syncRatedServicesFromBackend();
    this.loadRequests();
  }

  /**
   * Sincronizar avaliações do backend com localStorage
   */
  private syncRatedServicesFromBackend(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !currentUser.id) {
      return;
    }

    this.ratingService.getMyRatings(currentUser.id).subscribe({
      next: (ratings) => {
        // Extrair IDs dos serviços que foram avaliados
        if (ratings && ratings.length > 0) {
          ratings.forEach(rating => {
            if (rating.servicesDTO?.id) {
              this.ratedServiceIds().add(rating.servicesDTO.id);
              console.log(`✓ Adicionado serviço avaliado ${rating.servicesDTO.id} do backend`);
            }
          });
          // Salvar no localStorage
          this.saveRatedServicesToStorage();
        }
      },
      error: (err) => {
        console.warn('Não foi possível sincronizar avaliações do backend:', err);
      }
    });
  }

  /**
   * Carregar IDs de serviços avaliados do localStorage
   */
  private loadRatedServicesFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.RATED_SERVICES_KEY);
      if (stored) {
        const ids = JSON.parse(stored);
        this.ratedServiceIds.set(new Set(ids));
        console.log('✓ Serviços avaliados carregados do localStorage:', ids);
      } else {
        console.log('ℹ️ Nenhum serviço avaliado encontrado no localStorage');
      }
    } catch (err) {
      console.error('Erro ao carregar serviços avaliados do storage:', err);
    }
  }

  /**
   * Salvar IDs de serviços avaliados no localStorage
   */
  private saveRatedServicesToStorage(): void {
    try {
      const ids = Array.from(this.ratedServiceIds());
      localStorage.setItem(this.RATED_SERVICES_KEY, JSON.stringify(ids));
      console.log('✓ Serviços avaliados salvos no localStorage:', ids);
    } catch (err) {
      console.error('Erro ao salvar serviços avaliados no storage:', err);
    }
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
        
        // Recarregar status de avaliações do backend
        this.syncRatedServicesWithBackend(data);
      },
      error: (err) => {
        this.error.set('Erro ao carregar pedidos. Tente novamente.');
        this.loading.set(false);
        console.error('Erro:', err);
      }
    });
  }

  /**
   * Sincronizar avaliações com o backend para marcar como avaliadas
   */
  private syncRatedServicesWithBackend(requests: ServiceRequestResponseDTO[]): void {
    // Verificar quais serviços tem avaliações no backend
    const completedRequests = requests.filter(r => r.status === ServiceRequestStatus.COMPLETED);
    
    completedRequests.forEach(req => {
      const reqId = Number(req.id);
      
      // Se já está marcado como avaliado, pula
      if (this.isServiceRated(reqId)) {
        console.log(`✓ Serviço ${reqId} já marcado como avaliado`);
        return;
      }
      
      // Tentar verificar se existe avaliação no backend para este serviço
      // O endpoint GET /service/{id}/ratings pode ser criado se necessário
      // Por enquanto, confiar no localStorage
      console.log(`? Verificando avaliação para serviço ${reqId}`);
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

  /**
   * Abrir modal de avaliação
   */
  openRatingModal(request: ServiceRequestResponseDTO): void {
    this.selectedRequestForRating.set(request);
    this.showRatingModal.set(true);
  }

  /**
   * Fechar modal de avaliação
   */
  closeRatingModal(): void {
    this.showRatingModal.set(false);
    this.selectedRequestForRating.set(null);
  }

  /**
   * Callback ao enviar avaliação
   */
  onRatingSubmitted(): void {
    const request = this.selectedRequestForRating();
    if (request) {
      this.ratedServiceIds().add(Number(request.id));
      this.saveRatedServicesToStorage();
    }
    this.closeRatingModal();
  }

  /**
   * Verificar se um serviço já foi avaliado (verificar localStorage E backend)
   */
  isServiceRated(serviceId: string | number): boolean {
    return this.ratedServiceIds().has(Number(serviceId));
  }

  /**
   * Limpar cache de avaliações (útil para refresh)
   */
  clearRatedServicesCache(): void {
    try {
      localStorage.removeItem(this.RATED_SERVICES_KEY);
      this.ratedServiceIds.set(new Set());
    } catch (err) {
      console.error('Erro ao limpar cache de avaliações:', err);
    }
  }

  /**
   * Converter ID do serviço para número
   */
  getServiceIdAsNumber(id: string | number | undefined): number {
    return Number(id) || 0;
  }
}
