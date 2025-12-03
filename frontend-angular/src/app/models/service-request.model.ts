/**
 * Models para o fluxo de requisição de serviços
 * 
 * Fluxo:
 * 1. Usuário cria pedido (PENDING_BUDGET) → descrição do que precisa
 * 2. Freelancer envia orçamento (BUDGETED) → valor + tempo estimado
 * 3. Usuário aceita (ACCEPTED) → freelancer recebe telefone
 *    OU rejeita (REJECTED) → pedido cancelado
 * 4. Freelancer executa (IN_PROGRESS)
 * 5. Freelancer finaliza (COMPLETED)
 */

import { UserSimpleResponseDTO } from './user.model';
import { FreelancerSimpleResponseDTO } from './freelancer.model';

// Status do pedido/requisição
export enum ServiceRequestStatus {
  PENDING_BUDGET = 'PENDING_BUDGET',     // Aguardando orçamento do freelancer
  BUDGETED = 'BUDGETED',                 // Freelancer enviou orçamento
  ACCEPTED = 'ACCEPTED',                 // Usuário aceitou orçamento
  REJECTED = 'REJECTED',                 // Usuário rejeitou orçamento
  IN_PROGRESS = 'IN_PROGRESS',           // Serviço em andamento
  COMPLETED = 'COMPLETED',               // Serviço concluído
  CANCELLED = 'CANCELLED'                // Cancelado
}

export const ServiceRequestStatusLabels: Record<ServiceRequestStatus, string> = {
  [ServiceRequestStatus.PENDING_BUDGET]: 'Aguardando Orçamento',
  [ServiceRequestStatus.BUDGETED]: 'Orçamento Enviado',
  [ServiceRequestStatus.ACCEPTED]: 'Aceito',
  [ServiceRequestStatus.REJECTED]: 'Rejeitado',
  [ServiceRequestStatus.IN_PROGRESS]: 'Em Andamento',
  [ServiceRequestStatus.COMPLETED]: 'Concluído',
  [ServiceRequestStatus.CANCELLED]: 'Cancelado'
};

// DTO para criar pedido (Usuário → Freelancer)
export interface CreateServiceRequestDTO {
  freelancerId: number;           // ID do freelancer para quem está pedindo
  title: string;                  // Título breve do serviço
  description: string;            // Descrição detalhada do que precisa
}

// DTO para freelancer enviar orçamento
export interface SendBudgetDTO {
  price: number;                  // Valor cobrado
  estimatedDays?: number;         // Tempo estimado em dias (opcional)
  notes?: string;                 // Observações do freelancer sobre o orçamento
}

// DTO para usuário responder orçamento
export interface RespondBudgetDTO {
  accept: boolean;                // true = aceitar, false = rejeitar
  message?: string;               // Mensagem opcional do usuário
}

// Resposta completa do pedido
export interface ServiceRequestResponseDTO {
  id: string | number;
  title: string;
  description: string;            // Descrição do usuário
  status: ServiceRequestStatus;
  
  // Orçamento (preenchido quando freelancer enviar)
  price?: number;
  estimatedDays?: number;
  budgetNotes?: string;
  budgetSentAt?: string;          // Data que freelancer enviou orçamento
  
  // Resposta do usuário
  userResponse?: 'accepted' | 'rejected';
  userMessage?: string;
  respondedAt?: string;           // Data que usuário respondeu
  
  // Relacionamentos
  user: UserSimpleResponseDTO;    // Cliente que pediu
  freelancer: FreelancerSimpleResponseDTO; // Freelancer que vai executar
  
  // Contato (visível apenas após aceitar)
  userPhone?: string;             // Telefone liberado após aceitação
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// DTO simplificado para listagens
export interface ServiceRequestSimpleDTO {
  id: string | number;
  title: string;
  status: ServiceRequestStatus;
  price?: number;
  estimatedDays?: number;
  userName: string;
  freelancerName: string;
  createdAt: string;
}

// Filtros para busca
export interface ServiceRequestFilters {
  status?: ServiceRequestStatus[];
  userId?: number;
  freelancerId?: number;
  dateFrom?: string;
  dateTo?: string;
}

// Estatísticas para dashboard
export interface ServiceRequestStats {
  total: number;
  pendingBudget: number;
  budgeted: number;
  accepted: number;
  inProgress: number;
  completed: number;
  rejected: number;
  cancelled: number;
}
