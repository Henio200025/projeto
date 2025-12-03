/**
 * Utilitários para compatibilidade entre models antigos e novos
 * Permite que componentes existentes continuem funcionando
 */

import { ServicesResponseDTO } from './service.model';
import { FreelancerResponseDTO } from './freelancer.model';
import { CategoryType, CategoryTypeLabels, ServiceStatus } from './enums';

// Interface legacy do MockApiService
export interface ServiceItem {
  id: number | string;
  title: string;
  description?: string;
  price?: number;
  deliveryTime?: string;
  category?: string;
  thumbnailUrl?: string;
  reviews?: Array<{ 
    id: string; 
    score: number; 
    comment?: string; 
    createdAt?: string; 
    user?: { id: string; name: string } 
  }>;
  freelancer?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    reviews?: number;
  };
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  count?: number;
}

/**
 * Converte ServicesResponseDTO (backend Java) para ServiceItem (UI legacy)
 */
export function mapServiceResponseToServiceItem(service: ServicesResponseDTO): ServiceItem {
  return {
    id: service.id,
    title: `Serviço #${service.id}`, // Backend não tem title
    description: service.description,
    price: Number(service.price),
    deliveryTime: calculateDeliveryTime(service.status),
    category: ((): string => {
      const fl = service.freelancer as any;
      const catName = fl?.category?.name ?? fl?.category ?? undefined;
      return (catName ? CategoryTypeLabels[catName as CategoryType] : 'Serviços');
    })(),
    thumbnailUrl: '',
    freelancer: {
      id: String(service.freelancer.id),
      name: service.freelancer.user.name,
      avatar: service.freelancer.user.name.substring(0, 2).toUpperCase(),
      rating: 0, // Precisa buscar separadamente
      reviews: 0
    },
    reviews: [] // Precisa buscar separadamente
  };
}

/**
 * Converte FreelancerResponseDTO para formato legacy
 */
export function mapFreelancerResponseToLegacy(freelancer: FreelancerResponseDTO): any {
  return {
    id: String(freelancer.id),
    userId: String(freelancer.user.id),
    title: freelancer.title,
    bio: freelancer.description,
    skills: [CategoryTypeLabels[freelancer.category.name as CategoryType]],
    categories: [CategoryTypeLabels[freelancer.category.name as CategoryType]],
    hourlyRate: 0,
    location: '',
    createdAt: new Date().toISOString()
  };
}

/**
 * Mapeia CategoryType para Category (UI)
 */
export function getCategoriesForUI(): Category[] {
  return Object.entries(CategoryTypeLabels).map(([key, value], index) => ({
    id: index + 1,
    name: value,
    icon: getCategoryIcon(key as CategoryType),
    count: 0
  }));
}

/**
 * Calcula tempo de entrega baseado no status
 */
function calculateDeliveryTime(status: ServiceStatus): string {
  switch (status) {
    case ServiceStatus.PENDING:
      return 'Aguardando confirmação';
    case ServiceStatus.PENDING_BUDGET:
      return 'Aguardando orçamento';
    case ServiceStatus.BUDGETED:
      return 'Orçamento enviado';
    case ServiceStatus.ACCEPTED:
      return '3-5 dias';
    case ServiceStatus.COMPLETED:
      return 'Concluído';
    case ServiceStatus.CANCELLED:
      return 'Cancelado';
    case ServiceStatus.REJECTED:
      return 'Rejeitado';
    default:
      return 'A definir';
  }
}

/**
 * Retorna ícone para categoria
 */
function getCategoryIcon(category: CategoryType): string {
  const icons: Record<CategoryType, string> = {
    [CategoryType.Technology]: '💻',
    [CategoryType.HomeServices]: '🧰',
    [CategoryType.HealthAndWellness]: '💪',
    [CategoryType.Education]: '📚',
    [CategoryType.CreativeArts]: '🎨',
    [CategoryType.BusinessAndFinance]: '💼',
    [CategoryType.PersonalCare]: '💆',
    [CategoryType.EventsAndEntertainment]: '🎉',
    [CategoryType.WritingAndTranslation]: '✍️',
    [CategoryType.MarketingAndSales]: '📈',
    [CategoryType.LegalAndConsulting]: '⚖️',
    [CategoryType.Other]: '📦'
  };
  return icons[category] || '📦';
}
