/**
 * Serviço para gerenciar requisições de serviços
 * 
 * Gerencia o fluxo completo:
 * - Usuário cria pedido
 * - Freelancer envia orçamento
 * - Usuário aceita/rejeita
 * - Acompanhamento de status
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { MockApiService } from './mock-api.service';
import { NotificationService } from './notification.service';
import {
  CreateServiceRequestDTO,
  SendBudgetDTO,
  RespondBudgetDTO,
  ServiceRequestResponseDTO,
  ServiceRequestSimpleDTO,
  ServiceRequestFilters,
  ServiceRequestStats,
  ServiceRequestStatus
} from '../models/service-request.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestManagementService {
  private readonly API_BASE = '/api/service-requests';
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private mockApi = inject(MockApiService);
  private notificationService = inject(NotificationService);

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // ==================== CRIAR PEDIDO (USUÁRIO) ====================

  /**
   * Usuário cria pedido para um freelancer
   * POST /api/service-requests
   * Status inicial: PENDING_BUDGET
   */
  createRequest(data: CreateServiceRequestDTO): Observable<ServiceRequestResponseDTO> {
    // Try mock path first
    try {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        // Mock API usa serviceId, n\u00e3o freelancerId
        const serviceId = (data as any).serviceId || data.freelancerId;
        const payload = { 
          user: { id: String(currentUser.id), name: currentUser.name }, 
          message: data.description,
          title: data.title
        };
        const resp$ = (this.mockApi as any).postRequest(serviceId, payload);
        return resp$.pipe(
          map((r: any) => {
            if (!r) {
              throw new Error('Falha ao criar requisição no mock');
            }
            // Notificar freelancer sobre novo pedido
            this.notificationService.addNotification('new_request', r.id, data.title);
            return { 
              id: r.id,
              title: data.title,
              description: data.description,
              freelancerId: data.freelancerId,
              status: ServiceRequestStatus.PENDING_BUDGET,
              createdAt: r.createdAt || new Date().toISOString()
            } as any as ServiceRequestResponseDTO;
          })
        );
      }
    } catch (e) {
      console.error('Mock path failed:', e);
    }
    return this.http.post<ServiceRequestResponseDTO>(
      this.API_BASE,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      tap(res => {
        this.notificationService.addNotification('new_request', res.id, res.title);
      })
    );
  }

  // ==================== FREELANCER GERENCIA ORÇAMENTOS ====================

  /**
   * Freelancer envia orçamento para o pedido
   * POST /api/service-requests/{id}/budget
   * Status: PENDING_BUDGET → BUDGETED
   */
  sendBudget(requestId: string | number, budget: SendBudgetDTO): Observable<ServiceRequestResponseDTO> {
    try {
      const reqs = (this.mockApi as any).requests || [];
      // find by id equality (supports 'req500' or numeric)
      const r = reqs.find((x: any) => x.id == requestId);
      if (r) {
        r.price = budget.price;
        r.estimatedDays = budget.estimatedDays;
        r.budgetNotes = budget.notes;
        r.budgetSentAt = new Date().toISOString();
        r.status = 'BUDGETED';
        
        // Notificar o cliente que recebeu orçamento
        this.notificationService.addNotification('budget_received', requestId, r.title);
        
        return of({
          id: r.id,
          title: `Pedido ${r.id}`,
          description: r.message || '',
          status: ServiceRequestStatus.BUDGETED,
          price: r.price,
          estimatedDays: r.estimatedDays,
          budgetNotes: r.budgetNotes,
          user: { id: Number(r.user.id), name: r.user.name },
          freelancer: { id: r.serviceId, title: '', user: { id: 0, name: '' } },
          createdAt: r.createdAt,
          updatedAt: new Date().toISOString()
        } as ServiceRequestResponseDTO);
      }
    } catch (e) {}
    return this.http.post<ServiceRequestResponseDTO>(
      `${this.API_BASE}/${requestId}/budget`,
      budget,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        this.notificationService.addNotification('budget_received', requestId, response.title);
      })
    );
  }

  /**
   * Freelancer atualiza orçamento (antes do usuário aceitar)
   * PUT /api/service-requests/{id}/budget
   */
  updateBudget(requestId: string | number, budget: SendBudgetDTO): Observable<ServiceRequestResponseDTO> {
    try {
      const reqs = (this.mockApi as any).requests || [];
      const r = reqs.find((x: any) => x.id == requestId);
      if (r) {
        r.price = budget.price;
        r.estimatedDays = budget.estimatedDays;
        r.budgetNotes = budget.notes;
        r.updatedAt = new Date().toISOString();
        return of({
          ...(r as any),
          id: r.id,
          status: r.status === 'PENDING' ? ServiceRequestStatus.PENDING_BUDGET : (r.status as any)
        } as ServiceRequestResponseDTO);
      }
    } catch (e) {}
    return this.http.put<ServiceRequestResponseDTO>(
      `${this.API_BASE}/${requestId}/budget`,
      budget,
      { headers: this.getHeaders() }
    );
  }

  // ==================== USUÁRIO RESPONDE ORÇAMENTO ====================

  /**
   * Usuário aceita ou rejeita orçamento
   * POST /api/service-requests/{id}/respond
   * Status: BUDGETED → ACCEPTED (libera telefone) ou REJECTED
   */
  respondBudget(requestId: string | number, response: RespondBudgetDTO): Observable<ServiceRequestResponseDTO> {
    try {
      const reqs = (this.mockApi as any).requests || [];
      const r = reqs.find((x: any) => x.id == requestId);
      if (r) {
        r.userResponse = response.accept ? 'accepted' : 'rejected';
        r.userMessage = response.message;
        r.respondedAt = new Date().toISOString();
        r.status = response.accept ? 'ACCEPTED' : 'REJECTED';
        
        // Se aceito, compartilha o telefone do usuário com o freelancer
        if (response.accept) {
          const currentUser = this.authService.currentUserValue;
          r.userPhone = currentUser?.phone || '(não cadastrado)';
          // Notificar freelancer que orçamento foi aceito
          this.notificationService.addNotification('budget_accepted', requestId, r.title);
        } else {
          // Notificar freelancer que orçamento foi rejeitado
          this.notificationService.addNotification('budget_rejected', requestId, r.title);
        }
        
        return of({
          ...(r as any),
          id: r.id,
          status: r.status as any
        } as ServiceRequestResponseDTO);
      }
    } catch (e) {}
    return this.http.post<ServiceRequestResponseDTO>(
      `${this.API_BASE}/${requestId}/respond`,
      response,
      { headers: this.getHeaders() }
    ).pipe(
      tap(res => {
        const notifType = response.accept ? 'budget_accepted' : 'budget_rejected';
        this.notificationService.addNotification(notifType, requestId, res.title);
      })
    );
  }

  // ==================== GERENCIAR STATUS ====================

  /**
   * Freelancer inicia trabalho
   * PATCH /api/service-requests/{id}/start
   * Status: ACCEPTED → IN_PROGRESS
   */
  startWork(requestId: string | number): Observable<ServiceRequestResponseDTO> {
      try {
        const reqs = (this.mockApi as any).requests || [];
        const r = reqs.find((x: any) => x.id == requestId);
        if (r) {
          r.status = 'IN_PROGRESS';
          // Notificar cliente que trabalho foi iniciado
          this.notificationService.addNotification('work_started', requestId, r.title);
          return of({ ...(r as any), id: r.id } as ServiceRequestResponseDTO);
        }
      } catch (e) {}
      return this.http.patch<ServiceRequestResponseDTO>(
        `${this.API_BASE}/${requestId}/start`,
        {},
        { headers: this.getHeaders() }
      ).pipe(
        tap(res => {
          this.notificationService.addNotification('work_started', requestId, res.title);
        })
      );
  }

  /**
   * Freelancer completa trabalho
   * PATCH /api/service-requests/{id}/complete
   * Status: IN_PROGRESS → COMPLETED
   */
  completeWork(requestId: string | number): Observable<ServiceRequestResponseDTO> {
      try {
        const reqs = (this.mockApi as any).requests || [];
        const r = reqs.find((x: any) => x.id == requestId);
        if (r) {
          r.status = 'COMPLETED';
          // Notificar cliente que trabalho foi concluído
          this.notificationService.addNotification('work_completed', requestId, r.title);
          return of({ ...(r as any), id: r.id } as ServiceRequestResponseDTO);
        }
      } catch (e) {}
      return this.http.patch<ServiceRequestResponseDTO>(
        `${this.API_BASE}/${requestId}/complete`,
        {},
        { headers: this.getHeaders() }
      ).pipe(
        tap(res => {
          this.notificationService.addNotification('work_completed', requestId, res.title);
        })
      );
  }

  /**
   * Cancelar pedido (usuário ou freelancer)
   * PATCH /api/service-requests/{id}/cancel
   * Status: * → CANCELLED
   */
  cancelRequest(requestId: string | number, reason?: string): Observable<ServiceRequestResponseDTO> {
      try {
        const reqs = (this.mockApi as any).requests || [];
        const r = reqs.find((x: any) => x.id == requestId);
        if (r) {
          r.status = 'CANCELLED';
          r.cancelReason = reason;
          return of({ ...(r as any), id: r.id } as ServiceRequestResponseDTO);
        }
      } catch (e) {}
      return this.http.patch<ServiceRequestResponseDTO>(
        `${this.API_BASE}/${requestId}/cancel`,
        { reason },
        { headers: this.getHeaders() }
      );
  }

  // ==================== BUSCAR E LISTAR ====================

  /**
   * Buscar pedido por ID
   * GET /api/service-requests/{id}
   */
  getRequestById(requestId: string | number): Observable<ServiceRequestResponseDTO> {
    return this.http.get<ServiceRequestResponseDTO>(
      `${this.API_BASE}/${requestId}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Listar pedidos do usuário (quem pediu)
   * GET /api/service-requests/my-requests
   */
  getMyRequests(filters?: ServiceRequestFilters): Observable<ServiceRequestResponseDTO[]> {
    // If running with mock (MockApiService seeded), build data from mock
    try {
      // try to use mock data
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        const uid = String(currentUser.id);
        const reqs = (this.mockApi as any).requests || [];
        const services = (this.mockApi as any).services || [];
        const mapped = reqs
          .filter((r: any) => String(r.user?.id) === uid)
          .map((r: any) => {
            const svc = services.find((s: any) => s.id == r.serviceId) || null;
            return {
              id: r.id,
              title: svc ? svc.title : `Pedido ${r.id}`,
              description: r.message || '',
              status: r.status === 'PENDING' ? ServiceRequestStatus.PENDING_BUDGET : (r.status as any) || ServiceRequestStatus.PENDING_BUDGET,
              price: r.price !== undefined ? r.price : null,
              estimatedDays: r.estimatedDays || null,
              budgetNotes: r.budgetNotes || null,
              user: { id: Number(r.user.id), name: r.user.name },
              freelancer: svc ? { id: svc.freelancer.id, title: svc.freelancer.name, user: { id: svc.freelancer.id, name: svc.freelancer.name } } : { id: 0, title: '', user: { id: 0, name: '' } },
              createdAt: r.createdAt,
              updatedAt: r.updatedAt || r.createdAt
            } as ServiceRequestResponseDTO;
          });
        return of(mapped);
      }
    } catch (e) {
      // fallback to HTTP
    }
    return this.http.get<ServiceRequestResponseDTO[]>(
      `${this.API_BASE}/my-requests`,
      { 
        headers: this.getHeaders(),
        params: this.buildParams(filters)
      }
    );
  }

  /**
   * Listar trabalhos do freelancer (quem vai executar)
   * GET /api/service-requests/my-jobs
   */
  getMyJobs(filters?: ServiceRequestFilters): Observable<ServiceRequestResponseDTO[]> {
    try {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        const fid = String(currentUser.id);
        const reqs = (this.mockApi as any).requests || [];
        const services = (this.mockApi as any).services || [];
        const mapped = reqs
          .filter((r: any) => {
            const svc = services.find((s: any) => s.id == r.serviceId);
            const flId = svc?.freelancer?.id;
            return String(flId) === fid || String(svc?.freelancer?.userId || '') === fid;
          })
          .map((r: any) => {
            const svc = services.find((s: any) => s.id == r.serviceId) || null;
            return {
              id: r.id,
              title: svc ? svc.title : `Pedido ${r.id}`,
              description: r.message || '',
              status: r.status === 'PENDING' ? ServiceRequestStatus.PENDING_BUDGET : (r.status as any) || ServiceRequestStatus.PENDING_BUDGET,
              price: r.price,
              estimatedDays: r.estimatedDays,
              budgetNotes: r.budgetNotes,
              userPhone: r.userPhone,
              user: { id: Number(r.user.id), name: r.user.name },
              freelancer: svc ? { id: svc.freelancer.id, title: svc.freelancer.name, user: { id: svc.freelancer.id, name: svc.freelancer.name } } : { id: 0, title: '', user: { id: 0, name: '' } },
              createdAt: r.createdAt,
              updatedAt: r.updatedAt || r.createdAt
            } as ServiceRequestResponseDTO;
          });
        return of(mapped);
      }
    } catch (e) {}
    return this.http.get<ServiceRequestResponseDTO[]>(
      `${this.API_BASE}/my-jobs`,
      { 
        headers: this.getHeaders(),
        params: this.buildParams(filters)
      }
    );
  }

  /**
   * Estatísticas dos pedidos do usuário
   * GET /api/service-requests/my-requests/stats
   */
  getMyRequestsStats(): Observable<ServiceRequestStats> {
    return this.http.get<ServiceRequestStats>(
      `${this.API_BASE}/my-requests/stats`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Estatísticas dos trabalhos do freelancer
   * GET /api/service-requests/my-jobs/stats
   */
  getMyJobsStats(): Observable<ServiceRequestStats> {
    return this.http.get<ServiceRequestStats>(
      `${this.API_BASE}/my-jobs/stats`,
      { headers: this.getHeaders() }
    );
  }

  // ==================== HELPERS ====================

  private buildParams(filters?: ServiceRequestFilters): any {
    if (!filters) return {};
    
    const params: any = {};
    
    if (filters.status && filters.status.length > 0) {
      params.status = filters.status.join(',');
    }
    if (filters.userId) {
      params.userId = filters.userId.toString();
    }
    if (filters.freelancerId) {
      params.freelancerId = filters.freelancerId.toString();
    }
    if (filters.dateFrom) {
      params.dateFrom = filters.dateFrom;
    }
    if (filters.dateTo) {
      params.dateTo = filters.dateTo;
    }
    
    return params;
  }

  /**
   * Verifica se usuário pode responder orçamento
   */
  canRespondBudget(request: ServiceRequestResponseDTO): boolean {
    return request.status === ServiceRequestStatus.BUDGETED;
  }

  /**
   * Verifica se freelancer pode enviar/atualizar orçamento
   */
  canSendBudget(request: ServiceRequestResponseDTO): boolean {
    return request.status === ServiceRequestStatus.PENDING_BUDGET || 
           request.status === ServiceRequestStatus.BUDGETED;
  }

  /**
   * Verifica se pode iniciar trabalho
   */
  canStartWork(request: ServiceRequestResponseDTO): boolean {
    return request.status === ServiceRequestStatus.ACCEPTED;
  }

  /**
   * Verifica se pode completar trabalho
   */
  canCompleteWork(request: ServiceRequestResponseDTO): boolean {
    return request.status === ServiceRequestStatus.IN_PROGRESS;
  }

  /**
   * Verifica se telefone está liberado
   * Telefone disponível apenas quando aceito ou em progresso
   * Após conclusão, acesso é removido
   */
  isPhoneAvailable(request: ServiceRequestResponseDTO): boolean {
    return request.status === ServiceRequestStatus.ACCEPTED || 
           request.status === ServiceRequestStatus.IN_PROGRESS;
  }
}
