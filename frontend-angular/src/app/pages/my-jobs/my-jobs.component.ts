import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRequestManagementService } from '../../services/service-request-management.service';
import { BudgetProposalModalComponent } from '../../components/budget-proposal-modal/budget-proposal-modal.component';
import {
  ServiceRequestResponseDTO,
  ServiceRequestStatus,
  ServiceRequestStatusLabels,
  SendBudgetDTO
} from '../../models/service-request.model';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, BudgetProposalModalComponent],
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  private requestService = inject(ServiceRequestManagementService);
  
  jobs = signal<ServiceRequestResponseDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Para filtros
  selectedStatus = signal<ServiceRequestStatus | 'all'>('all');
  
  // Para enviar orçamento via modal
  showBudgetModal = signal(false);
  selectedJobForBudget = signal<ServiceRequestResponseDTO | null>(null);
  
  // Enums expostos para o template
  readonly StatusEnum = ServiceRequestStatus;
  readonly StatusLabels = ServiceRequestStatusLabels;

  // Computed lists to avoid using inline lambdas in templates
  get pendingBudgetJobs(): ServiceRequestResponseDTO[] {
    return this.jobs().filter(j => j.status === ServiceRequestStatus.PENDING);
  }

  get pendingBudgetCount(): number {
    return this.pendingBudgetJobs.length;
  }

  get acceptedJobs(): ServiceRequestResponseDTO[] {
    return this.jobs().filter(j => j.status === ServiceRequestStatus.CONFIRMED || j.status === ServiceRequestStatus.IN_PROGRESS);
  }

  // Lista filtrada para o template, conforme selectedStatus
  get visibleJobs(): ServiceRequestResponseDTO[] {
    const sel = this.selectedStatus();
    if (sel === 'all') return this.jobs();
    return this.jobs().filter(j => j.status === sel);
  }

  get acceptedCount(): number {
    return this.acceptedJobs.length;
  }

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading.set(true);
    this.error.set(null);
    
    const filters = this.selectedStatus() !== 'all' 
      ? { status: [this.selectedStatus() as ServiceRequestStatus] }
      : undefined;

    this.requestService.getMyJobs(filters).subscribe({
      next: (data) => {
        this.jobs.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar trabalhos. Tente novamente.');
        this.loading.set(false);
        console.error('Erro:', err);
      }
    });
  }

  filterByStatus(status: ServiceRequestStatus | 'all') {
    this.selectedStatus.set(status);
    this.loadJobs();
  }

  openBudgetModal(job: ServiceRequestResponseDTO) {
    this.selectedJobForBudget.set(job);
    this.showBudgetModal.set(true);
  }

  closeBudgetModal() {
    this.showBudgetModal.set(false);
    this.selectedJobForBudget.set(null);
  }

  onProposalSent() {
    this.closeBudgetModal();
    this.loadJobs();
  }

  startWork(jobId: string | number) {
    if (!confirm('Iniciar este trabalho?')) return;

    this.requestService.startWork(jobId).subscribe({
      next: () => {
        alert('Trabalho iniciado!');
        this.loadJobs();
      },
      error: (err) => {
        alert('Erro ao iniciar trabalho. Tente novamente.');
        console.error('Erro:', err);
      }
    });
  }

  completeWork(jobId: string | number) {
    if (!confirm('Marcar este trabalho como concluído?')) return;

    this.requestService.completeWork(jobId).subscribe({
      next: () => {
        alert('Trabalho concluído!');
        this.loadJobs();
      },
      error: (err) => {
        alert('Erro ao completar trabalho. Tente novamente.');
        console.error('Erro:', err);
      }
    });
  }

  cancelJob(jobId: string | number) {
    const reason = prompt('Por que deseja cancelar este trabalho? (opcional)');
    
    if (reason === null) return; // Cancelou

    this.requestService.cancelRequest(jobId, reason || undefined).subscribe({
      next: () => {
        alert('Trabalho cancelado.');
        this.loadJobs();
      },
      error: (err) => {
        alert('Erro ao cancelar trabalho. Tente novamente.');
        console.error('Erro:', err);
      }
    });
  }

  canSendBudget(job: ServiceRequestResponseDTO): boolean {
    return this.requestService.canSendBudget(job);
  }

  canStartWork(job: ServiceRequestResponseDTO): boolean {
    return this.requestService.canStartWork(job);
  }

  canCompleteWork(job: ServiceRequestResponseDTO): boolean {
    return this.requestService.canCompleteWork(job);
  }

  isPhoneAvailable(job: ServiceRequestResponseDTO): boolean {
    return this.requestService.isPhoneAvailable(job);
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
}
