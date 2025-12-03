import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRequestManagementService } from '../../services/service-request-management.service';
import {
  ServiceRequestResponseDTO,
  ServiceRequestStatus,
  ServiceRequestStatusLabels,
  SendBudgetDTO
} from '../../models/service-request.model';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  
  // Para enviar orçamento
  sendingBudget = signal<string | number | null>(null);
  budgetForm = signal<{price: number, estimatedDays: number, notes: string}>({
    price: 0,
    estimatedDays: 0,
    notes: ''
  });
  
  // Enums expostos para o template
  readonly StatusEnum = ServiceRequestStatus;
  readonly StatusLabels = ServiceRequestStatusLabels;

  // Computed lists to avoid using inline lambdas in templates
  get pendingBudgetJobs(): ServiceRequestResponseDTO[] {
    return this.jobs().filter(j => j.status === ServiceRequestStatus.PENDING_BUDGET);
  }

  get pendingBudgetCount(): number {
    return this.pendingBudgetJobs.length;
  }

  get acceptedJobs(): ServiceRequestResponseDTO[] {
    return this.jobs().filter(j => j.status === ServiceRequestStatus.ACCEPTED || j.status === ServiceRequestStatus.IN_PROGRESS);
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

  openBudgetForm(jobId: string | number, currentBudget?: SendBudgetDTO) {
    this.sendingBudget.set(jobId);
    
    if (currentBudget) {
      // Editando orçamento existente
      this.budgetForm.set({
        price: currentBudget.price,
        estimatedDays: currentBudget.estimatedDays || 0,
        notes: currentBudget.notes || ''
      });
    } else {
      // Novo orçamento
      this.budgetForm.set({ price: 0, estimatedDays: 0, notes: '' });
    }
  }

  closeBudgetForm() {
    this.sendingBudget.set(null);
    this.budgetForm.set({ price: 0, estimatedDays: 0, notes: '' });
  }

  submitBudget(jobId: string | number, isUpdate: boolean) {
    const form = this.budgetForm();
    
    if (form.price <= 0) {
      alert('Informe um valor válido.');
      return;
    }

    const budget: SendBudgetDTO = {
      price: form.price,
      estimatedDays: form.estimatedDays > 0 ? form.estimatedDays : undefined,
      notes: form.notes || undefined
    };

    const request = isUpdate 
      ? this.requestService.updateBudget(jobId, budget)
      : this.requestService.sendBudget(jobId, budget);

    request.subscribe({
      next: () => {
        alert(isUpdate ? 'Orçamento atualizado!' : 'Orçamento enviado!');
        this.closeBudgetForm();
        this.loadJobs();
      },
      error: (err) => {
        alert('Erro ao enviar orçamento. Tente novamente.');
        console.error('Erro:', err);
      }
    });
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
