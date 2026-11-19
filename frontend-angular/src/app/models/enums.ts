/**
 * Enums utilizados no projeto
 * Alinhados com backend Java Spring Boot
 */

// Categorias de serviços
export enum CategoryType {
  Technology = 'Technology',
  HomeServices = 'HomeServices',
  HealthAndWellness = 'HealthAndWellness',
  Education = 'Education',
  CreativeArts = 'CreativeArts',
  BusinessAndFinance = 'BusinessAndFinance',
  PersonalCare = 'PersonalCare',
  EventsAndEntertainment = 'EventsAndEntertainment',
  WritingAndTranslation = 'WritingAndTranslation',
  MarketingAndSales = 'MarketingAndSales',
  LegalAndConsulting = 'LegalAndConsulting',
  Other = 'Other'
}

// Labels em português para as categorias
export const CategoryTypeLabels: Record<CategoryType, string> = {
  [CategoryType.Technology]: 'Tecnologia',
  [CategoryType.HomeServices]: 'Serviços Domésticos',
  [CategoryType.HealthAndWellness]: 'Saúde e Bem-estar',
  [CategoryType.Education]: 'Educação',
  [CategoryType.CreativeArts]: 'Artes Criativas',
  [CategoryType.BusinessAndFinance]: 'Negócios e Finanças',
  [CategoryType.PersonalCare]: 'Cuidados Pessoais',
  [CategoryType.EventsAndEntertainment]: 'Eventos e Entretenimento',
  [CategoryType.WritingAndTranslation]: 'Escrita e Tradução',
  [CategoryType.MarketingAndSales]: 'Marketing e Vendas',
  [CategoryType.LegalAndConsulting]: 'Jurídico e Consultoria',
  [CategoryType.Other]: 'Outros'
};

// Status do serviço (usado no backend)
export enum ServiceStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING_BUDGET = 'PENDING_BUDGET',
  BUDGETED = 'BUDGETED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}
