import { ServiceStatus } from './enums';
import { FreelancerSimpleResponseDTO } from './freelancer.model';
import { UserSimpleResponseDTO } from './user.model';

// Service models - alinhado com backend Java

export interface ServicesRequestDTO {
  price: number;        // BigDecimal
  location: string;
  description: string;
  createdAt?: string;   // ISO date
  userId: number;       // ⚠️ Será removido quando usar tokens no backend
}

export interface ServicesResponseDTO {
  id: number;
  status: ServiceStatus;
  price: number;
  location: string;
  description: string;
  createdAt: string;    // ISO date
  freelancer: FreelancerSimpleResponseDTO;
  user: UserSimpleResponseDTO;
}

export interface ServicesSimpleDTO {
  id: number;
  status: ServiceStatus;
  description: string;
  createdAt: string;
}

// Para compatibilidade com código existente
export interface Service {
  id: number;
  freelancerId: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  status: string;
  createdAt: string;
  freelancer: string; // Nome do freelancer
  rating?: number;
  reviewCount?: number;
  deliveryTime?: string;
  image?: string;
}
