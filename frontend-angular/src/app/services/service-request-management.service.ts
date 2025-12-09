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
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, catchError, retry, delay } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { MockApiService } from './mock-api.service';
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
  private readonly API_BASE = '/api/services';
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private mockApi = inject(MockApiService);

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
    const currentUser = this.authService.currentUserValue;
    const payload = {
      description: data.description,
      price: data.price,
      location: data.location,
      createdAt: data.createdAt,
      userId: data.userId
    };

    // Caminho mock para desenvolvimento local
    try {
      if (currentUser) {
        return this.mockApi.createService(data.freelancerProfileId, payload).pipe(
          map((res: any) => ({
            id: res?.id ?? Math.random().toString(),
            description: payload.description,
            status: ServiceRequestStatus.PENDING,
            price: payload.price,
            location: payload.location,
            user: { id: currentUser.id, name: currentUser.name },
            freelancer: { id: data.freelancerProfileId, title: '', user: { id: 0, name: '' } },
            createdAt: payload.createdAt
          } as ServiceRequestResponseDTO))
        );
      }
    } catch (e) {
      console.error('Mock path failed:', e);
    }

    return this.http.post<ServiceRequestResponseDTO>(
      `${this.API_BASE}/create/${data.freelancerProfileId}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  // ==================== FREELANCER GERENCIA ORÇAMENTOS ====================

  /**
   * Freelancer envia orçamento para o pedido
   * PATCH /services/{serviceId}/wait
   * Status: PENDING → WAITING_USER
   */
  sendBudget(requestId: string | number, budget: SendBudgetDTO): Observable<{ success: boolean }> {
    const payload = {
      price: budget.price,
      description: budget.description || ''
    };

    console.log('Enviando contraproposta:', { serviceId: requestId, payload });

    return this.http.patch(
      `${this.API_BASE}/${requestId}/wait`,
      payload,
      { 
        headers: this.getHeaders(),
        responseType: 'text'
      }
    ).pipe(
      retry({ count: 1, delay: 1000 }),
      map(() => ({ success: true })),
      tap(() => {
        console.log('✓ Contraproposta enviada com sucesso');
      }),
      catchError(err => {
        console.error('✗ Erro ao enviar contraproposta:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message || err.message || err.error,
          fullError: err
        });
        return throwError(() => err);
      })
    );
  }

  /**
   * Freelancer atualiza orçamento (antes do usuário aceitar)
   * PUT /api/service-requests/{id}/budget
   */
  updateBudget(requestId: string | number, budget: SendBudgetDTO): Observable<ServiceRequestResponseDTO> {
    const payload = {
      price: budget.price,
      description: budget.description
    };

    try {
      const reqs = (this.mockApi as any).requests || [];
      const r = reqs.find((x: any) => x.id == requestId);
      if (r) {
        r.price = budget.price;
        r.description = budget.description;
        r.status = ServiceRequestStatus.WAITING_USER;
        return of({ ...(r as any), id: r.id } as ServiceRequestResponseDTO);
      }
    } catch (e) {}

    return this.http.patch<ServiceRequestResponseDTO>(
      `${this.API_BASE}/${requestId}/wait`,
      payload,
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
        r.respondedAt = new Date().toISOString();
        r.status = response.accept ? ServiceRequestStatus.PENDING : ServiceRequestStatus.CANCELLED;

        return of({
          ...(r as any),
          id: r.id,
          status: r.status as any
        } as ServiceRequestResponseDTO);
      }
    } catch (e) {}
    if (!response.accept) {
      // Backend não tem rejeição explícita; usar cancel como fallback
      return this.cancelRequest(requestId, 'Usuário rejeitou orçamento');
    }

    return this.http.patch<ServiceRequestResponseDTO>(
      `${this.API_BASE}/${requestId}/accept`,
      response,
      { headers: this.getHeaders() }
    );
  }

  // ==================== GERENCIAR STATUS ====================

  startWork(requestId: string | number): Observable<ServiceRequestResponseDTO> {
    try {
      const reqs = (this.mockApi as any).requests || [];
      const r = reqs.find((x: any) => x.id == requestId);
      if (r) {
        r.status = ServiceRequestStatus.IN_PROGRESS;
        return of({ ...(r as any), id: r.id } as ServiceRequestResponseDTO);
      }
    } catch (e) {}
    return this.http.patch<ServiceRequestResponseDTO>(
      `${this.API_BASE}/${requestId}/in-progress`,
      {},
      { headers: this.getHeaders() }
    );
  }

  completeWork(requestId: string | number): Observable<ServiceRequestResponseDTO> {
    try {
      const reqs = (this.mockApi as any).requests || [];
      const r = reqs.find((x: any) => x.id == requestId);
      if (r) {
        r.status = ServiceRequestStatus.COMPLETED;
        return of({ ...(r as any), id: r.id } as ServiceRequestResponseDTO);
      }
    } catch (e) {}
    return this.http.patch<ServiceRequestResponseDTO>(
      `${this.API_BASE}/${requestId}/complete`,
      {},
      { headers: this.getHeaders() }
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
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      return of([]);
    }

    return this.http.get<ServiceRequestResponseDTO[]>(
      `${this.API_BASE}/user/${currentUser.id}`,
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
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      return of([]);
    }

    // Obter perfil do freelancer do usuário autenticado e, em seguida, buscar seus serviços
    return this.http.get<any[]>(`/api/freelancers/user/${currentUser.id}`, { headers: this.getHeaders() }).pipe(
      map((profiles) => profiles?.[0]?.id as number | undefined),
      switchMap((profileId) => {
        if (!profileId) return of([]);
        return this.http.get<ServiceRequestResponseDTO[]>(
          `/api/freelancers/${profileId}/services`,
          {
            headers: this.getHeaders(),
            params: this.buildParams(filters)
          }
        );
      })
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
    return request.status === ServiceRequestStatus.WAITING_USER;
  }

  /**
   * Verifica se freelancer pode enviar/atualizar orçamento
   */
  canSendBudget(request: ServiceRequestResponseDTO): boolean {
    return request.status === ServiceRequestStatus.PENDING;
  }

  /**
   * Verifica se pode iniciar trabalho
   */
  canStartWork(request: ServiceRequestResponseDTO): boolean {
    return request.status === ServiceRequestStatus.CONFIRMED;
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
    return request.status === ServiceRequestStatus.CONFIRMED || 
           request.status === ServiceRequestStatus.IN_PROGRESS;
  }
}
