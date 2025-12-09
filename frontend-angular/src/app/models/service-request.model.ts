/**
 * Models para o fluxo de requisição de serviços
 * 
 * Fluxo:
 * 1. Usuário cria pedido → serviço nasce em PENDING
 * 2. Freelancer pode colocar em WAITING_USER (ajusta preço/descrição)
 * 3. Usuário aceita o ajuste → volta a PENDING
 * 4. Freelancer confirma → CONFIRMED
 * 5. Freelancer move para IN_PROGRESS e depois COMPLETED
 * Ambos podem cancelar enquanto não estiver COMPLETED
 */

import { UserSimpleResponseDTO } from './user.model';
import { FreelancerSimpleResponseDTO } from './freelancer.model';

// Interface para telefone
export interface PhoneOption {
  id: number | string;
  number: string;
  description: string;
  isWhatsApp: boolean;
}

// Status do pedido/requisição
export enum ServiceRequestStatus {
  PENDING = 'PENDING',
  WAITING_USER = 'WAITING_USER',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export const ServiceRequestStatusLabels: Record<ServiceRequestStatus, string> = {
  [ServiceRequestStatus.PENDING]: 'Pendente',
  [ServiceRequestStatus.WAITING_USER]: 'Aguardando Usuário',
  [ServiceRequestStatus.CONFIRMED]: 'Confirmado',
  [ServiceRequestStatus.IN_PROGRESS]: 'Em Andamento',
  [ServiceRequestStatus.COMPLETED]: 'Concluído',
  [ServiceRequestStatus.CANCELLED]: 'Cancelado'
};

// DTO para criar pedido (Usuário → Freelancer)
export interface CreateServiceRequestDTO {
  freelancerProfileId: number;    // ID do perfil de freelancer
  description: string;            // Descrição do pedido
  price: number;                  // Valor proposto
  location: string;               // Local (ou Remoto)
  createdAt: string;              // Data/hora ISO
  userId: number;                 // ID do usuário autenticado
}

// DTO para freelancer enviar orçamento
export interface SendBudgetDTO {
  price?: number;                 // Valor ajustado pelo freelancer
  description?: string;           // Descrição ajustada (opcional)
}

// DTO para usuário responder ajuste (aceitar WAITING_USER)
export interface RespondBudgetDTO {
  accept: boolean;
  phone?: string;  // Telefone do cliente para o freelancer entrar em contato
}

// Resposta completa do pedido
export interface ServiceRequestResponseDTO {
  id: string | number;
  description: string;            // Descrição do serviço/pedido
  status: ServiceRequestStatus;
  
  price: number;
  location: string;
  clientPhone?: string;            // Telefone do cliente para contato

  // Relacionamentos
  user: UserSimpleResponseDTO;                 // Cliente que pediu
  freelancer: FreelancerSimpleResponseDTO;     // Freelancer que vai executar

  // Timestamps
  createdAt: string;
}

// DTO simplificado para listagens
export interface ServiceRequestSimpleDTO {
  id: string | number;
  status: ServiceRequestStatus;
  price: number;
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
