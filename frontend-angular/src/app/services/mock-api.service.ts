import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CategoryType, CategoryTypeLabels } from '../models/enums';
import { FreelancerResponseDTO } from '../models/freelancer.model';

export interface Category {
  id: number;
  name: string;
  icon?: string;
  count?: number;
}

export interface Freelancer {
  id: string;
  name: string;
  avatar?: string;
  rating?: number;
  reviews?: number;
  userId?: string;
}

export interface ServiceItem {
  id: number | string;
  description: string;
  price: number;
  location: string;
  createdAt: string;
  userId: number;
  thumbnailUrl?: string;
  // images are not provided by backend endpoints — UI should use placeholders
  reviews?: Array<{ id: string; score: number; comment?: string; createdAt?: string; user?: { id: string; name: string } }>;
  freelancer?: Freelancer;
}

// Card para explorar freelancers (catálogo)
export interface FreelancerListItem {
  id: number | string;
  title: string;
  description: string;
  category: CategoryType;
  averageRating: number;
  reviews?: number;
  userName: string;
}

export interface RequestItem {
  id: string;
  serviceId: string | number;
  user: { id: string; name: string };
  message?: string;
  title?: string;
  status?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class MockApiService {
  // Categorias do backend (CategoryType enum)
  private categories: Category[] = [
    { id: 1, name: CategoryType.Technology, icon: '💻', count: 45 },
    { id: 2, name: CategoryType.HomeServices, icon: '🏠', count: 120 },
    { id: 3, name: CategoryType.HealthAndWellness, icon: '💪', count: 67 },
    { id: 4, name: CategoryType.Education, icon: '📚', count: 89 },
    { id: 5, name: CategoryType.CreativeArts, icon: '🎨', count: 156 },
    { id: 6, name: CategoryType.BusinessAndFinance, icon: '💼', count: 78 },
    { id: 7, name: CategoryType.PersonalCare, icon: '💅', count: 92 },
    { id: 8, name: CategoryType.EventsAndEntertainment, icon: '🎉', count: 134 },
    { id: 9, name: CategoryType.WritingAndTranslation, icon: '✍️', count: 103 },
    { id: 10, name: CategoryType.MarketingAndSales, icon: '📈', count: 88 },
    { id: 11, name: CategoryType.LegalAndConsulting, icon: '⚖️', count: 54 },
    { id: 12, name: CategoryType.Other, icon: '📦', count: 41 }
  ];

  // Serviços de teste alinhados com novo backend
  private services: ServiceItem[] = [];

  // Catálogo mock de freelancers (front agora explora freelancers)
  private freelancerCards: FreelancerListItem[] = [
    { id: 'f1', title: 'Reparo hidráulico residencial', description: 'Conserto de vazamentos, substituição de válvulas e manutenção preventiva', category: CategoryType.HomeServices, averageRating: 4.8, reviews: 34, userName: 'João Silva' },
    { id: 'f2', title: 'Instalação elétrica residencial', description: 'Troca de fiação, instalação de pontos e quadro elétrico', category: CategoryType.HomeServices, averageRating: 4.9, reviews: 52, userName: 'Mariana Costa' },
    { id: 'f3', title: 'Desenvolvimento de site institucional', description: 'Site responsivo com 5 páginas, SEO otimizado e painel admin', category: CategoryType.Technology, averageRating: 4.9, reviews: 127, userName: 'Sarah Johnson' },
    { id: 'f4', title: 'Aulas particulares de Inglês', description: 'Aulas online individuais para todos os níveis, material incluso', category: CategoryType.Education, averageRating: 4.7, reviews: 89, userName: 'Michael Brown' },
    { id: 'f5', title: 'Design de logotipo profissional', description: '3 conceitos iniciais, revisões ilimitadas, arquivos em alta resolução', category: CategoryType.CreativeArts, averageRating: 5.0, reviews: 156, userName: 'Isabella Rodrigues' },
    { id: 'f6', title: 'Consultoria de marketing digital', description: 'Análise completa, estratégia de redes sociais e plano de ação', category: CategoryType.MarketingAndSales, averageRating: 4.8, reviews: 74, userName: 'Lucas Mendes' },
    { id: 'f7', title: 'Tradução PT-EN profissional', description: 'Tradução certificada de documentos e textos técnicos', category: CategoryType.WritingAndTranslation, averageRating: 4.9, reviews: 103, userName: 'Amanda Santos' },
    { id: 'f8', title: 'Personal trainer online', description: 'Treino personalizado, acompanhamento semanal e plano nutricional', category: CategoryType.HealthAndWellness, averageRating: 4.8, reviews: 67, userName: 'Rafael Oliveira' },
    { id: 'f9', title: 'Manicure e pedicure domiciliar', description: 'Atendimento em domicílio com produtos profissionais', category: CategoryType.PersonalCare, averageRating: 4.9, reviews: 92, userName: 'Julia Lima' },
    { id: 'f10', title: 'DJ para festas e eventos', description: 'Equipamento profissional, playlist personalizada, 4 horas', category: CategoryType.EventsAndEntertainment, averageRating: 4.7, reviews: 134, userName: 'Bruno Castro' },
    { id: 'f11', title: 'Consultoria jurídica empresarial', description: 'Análise de contratos, parecer jurídico e orientação legal', category: CategoryType.LegalAndConsulting, averageRating: 5.0, reviews: 54, userName: 'Dr. Pedro Alves' },
    { id: 'f12', title: 'Assessoria financeira pessoal', description: 'Planejamento financeiro, investimentos e controle de gastos', category: CategoryType.BusinessAndFinance, averageRating: 4.8, reviews: 78, userName: 'Fernanda Souza' }
  ];

  // Seed test freelancer and service for local testing
  // Freelancer userId 2001, client userId 1001
  constructor(private http: HttpClient) {
    // add a dedicated freelancer profile
    const testFreelancer = {
      id: `fr_2001`,
      userId: '2001',
      title: 'Freelancer Test',
      description: 'Perfil de teste para o freelancer.',
      categories: [CategoryType.HomeServices],
      createdAt: new Date().toISOString()
    };
    this.freelancers.unshift(testFreelancer as any);

    // add a service owned by this freelancer
    const testService: ServiceItem = {
      id: 's100',
      description: 'Serviço completo de limpeza criado para teste entre contas mock.',
      price: 150,
      location: 'São Paulo, SP',
      createdAt: new Date().toISOString(),
      userId: 2001,
      thumbnailUrl: '',
      freelancer: { id: testFreelancer.id, userId: '2001', name: 'Freelancer Test', avatar: 'FT', rating: 4.7, reviews: 10 },
      reviews: []
    };
    this.services.unshift(testService);

    // add a pending request from client (userId 1001)
    const testRequest = {
      id: `req${this.nextRequestId++}`,
      serviceId: testService.id,
      user: { id: '1001', name: 'Cliente Test' },
      message: 'Olá, preciso deste serviço. Podemos conversar?',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    this.requests.unshift(testRequest as any);
  }

  private nextReviewId = 100;
  private nextRequestId = 500;
  private nextFreelancerId = 200;
  private nextServiceId = 4;

  private freelancers: Array<{ id: string; userId: string; title?: string; bio?: string; skills?: string[]; hourlyRate?: number; categories?: string[]; portfolioUrl?: string; location?: string; createdAt?: string }> = [];

  private requests: Array<{ id: string; serviceId: string | number; user: { id: string; name: string }; message?: string; status?: string; createdAt?: string }> = [];

  getCategories() {
    return of(this.categories).pipe(delay(200));
  }

  getFeaturedFreelancers() {
    return of(this.freelancerCards.slice(0, 4)).pipe(delay(200));
  }

  searchFreelancers(query = '', category?: string, page = 1, perPage = 12) {
    return this.searchFreelancersWithParams({ q: query, category, page, perPage });
  }

  // Busca real no backend
  getFreelancersFromApi() {
    // Use proxy /api para bater no backend Java
    return this.http.get<FreelancerResponseDTO[]>(`/api/freelancers`);
  }

  /**
   * Nova versão de busca que aceita um objeto de filtros.
   * Prepara o método para futura integração com backend real.
   */
  searchFreelancersWithParams(params: {
    q?: string;
    category?: string;
    page?: number;
    perPage?: number;
    minRating?: number;
  }) {
    const q = (params.q || '').toLowerCase();
    let results = this.freelancerCards.filter((f) => {
      return (
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.userName.toLowerCase().includes(q)
      );
    });

    if (params.category) {
      results = results.filter((f) => f.category === params.category);
    }
    if (typeof params.minRating === 'number') {
      results = results.filter((f) => f.averageRating >= params.minRating!);
    }

    const page = params.page || 1;
    const perPage = params.perPage || 12;
    const start = (page - 1) * perPage;
    const data = results.slice(start, start + perPage);

    const meta = { page, perPage, total: results.length };
    return of({ data, meta }).pipe(delay(200));
  }

  getServiceById(id: string | number) {
    const item = this.services.find((s) => s.id == id) || null;
    return of(item).pipe(delay(150));
  }

  getFreelancerCardById(id: string | number) {
    const item = this.freelancerCards.find((f) => f.id == id) || null;
    return of(item).pipe(delay(150));
  }

  postRating(serviceId: string | number, payload: { score: number; comment?: string; user?: { id: string; name: string } }) : import('rxjs').Observable<any> {
    const svc = this.services.find((s) => s.id == serviceId);
    if (!svc) return of(null).pipe(delay(100));

    const review = {
      id: `r${this.nextReviewId++}`,
      score: payload.score,
      comment: payload.comment || '',
      createdAt: new Date().toISOString(),
      user: payload.user || { id: 'anonymous', name: 'Anônimo' }
    } as any;

    svc.reviews = svc.reviews || [];
    svc.reviews.unshift(review);

    // update freelancer rating / reviews count mock
    const allScores = svc.reviews.map((r: any) => r.score);
    const avg = allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length;
    if (svc.freelancer) {
      svc.freelancer.rating = Math.round(avg * 10) / 10; // one decimal
      svc.freelancer.reviews = svc.freelancer.reviews ? svc.freelancer.reviews + 1 : svc.reviews.length;
    }

    return of(review).pipe(delay(150));
  }

  // requests (orçamentos)
  postRequest(serviceId: string | number, payload: { user: { id: string; name: string }; message?: string; title?: string }): import('rxjs').Observable<RequestItem | null> {
    const svc = this.services.find((s) => s.id == serviceId);
    if (!svc) return of(null as RequestItem | null).pipe(delay(100));

    const req = {
      id: `req${this.nextRequestId++}`,
      serviceId: serviceId as any,
      user: payload.user,
      message: payload.message || '',
      title: payload.title || 'Solicitação de Serviço',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.requests.unshift(req);
    return of(req as RequestItem).pipe(delay(150));
  }

  getRequestsByUser(userId: string | number) {
    const list = this.requests.filter((r) => r.user?.id == userId);
    return of(list).pipe(delay(100));
  }

  // freelancer endpoints
  createFreelancerForUser(userId: string | number, payload: { title: string; description: string; category: string }) {
    return this.http.post<FreelancerResponseDTO>(`/api/freelancers/${userId}/create`, payload);
  }

  updateFreelancer(id: string | number, payload: { title: string; description: string; category: string }) {
    return this.http.put<FreelancerResponseDTO>(`/api/freelancers/${id}`, payload);
  }

  createServiceForFreelancer(freelancerId: string | number, payload: { description: string; price: number; location: string; createdAt: string; userId: number; }) {
    // create a service and attach the freelancer meta
    const id = `s${this.nextServiceId++}`;
    const svc: ServiceItem = {
      id,
      description: payload.description,
      price: payload.price,
      location: payload.location,
      createdAt: payload.createdAt,
      userId: payload.userId,
      thumbnailUrl: '',
      freelancer: { id: freelancerId, name: 'Você', avatar: '', rating: undefined, reviews: undefined },
      reviews: []
    } as ServiceItem;

    // push to the beginning of services
    this.services.unshift(svc);
    return of(svc).pipe(delay(150));
  }

  createService(freelancerProfileId: number, payload: { description: string; price: number; location: string; createdAt: string; userId: number | undefined }) {
    return this.http.post(`/api/services/create/${freelancerProfileId}`, payload);
  }

  updateService(serviceId: number, payload: { description: string; price: number; location: string }) {
    return this.http.put(`/api/services/${serviceId}`, payload);
  }

  getServicesByFreelancerId(freelancerId: string | number) {
    const list = this.services.filter((s) => s.freelancer && s.freelancer.id == freelancerId);
    return of(list).pipe(delay(150));
  }

  getFreelancerById(id: string | number): Observable<FreelancerResponseDTO | null> {
    return this.http.get<FreelancerResponseDTO>(`/api/freelancers/${id}`);
  }

  getFreelancerByUserId(userId: string | number): Observable<FreelancerResponseDTO | null> {
    return this.http.get<FreelancerResponseDTO>(`/api/freelancers/user/${userId}`);
  }
}
