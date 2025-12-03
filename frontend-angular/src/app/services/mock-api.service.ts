import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CategoryType, CategoryTypeLabels } from '../models/enums';

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
  title: string;
  description?: string;
  price?: number;
  deliveryTime?: string;
  category?: string;
  thumbnailUrl?: string;
  // images are not provided by backend endpoints — UI should use placeholders
  reviews?: Array<{ id: string; score: number; comment?: string; createdAt?: string; user?: { id: string; name: string } }>;
  freelancer?: Freelancer;
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

  // Serviços de teste alinhados com backend (CategoryType enum)
  private services: ServiceItem[] = [
    {
      id: 's1',
      title: 'Reparo hidráulico residencial',
      description: 'Conserto de vazamentos, substituição de válvulas e manutenção preventiva',
      price: 120,
      deliveryTime: '1 dia',
      category: CategoryType.HomeServices,
      thumbnailUrl: '',
      freelancer: { id: 'u1', name: 'João Silva', avatar: 'JS', rating: 4.8, reviews: 34 },
      reviews: [
        { id: 'r1', score: 5, comment: 'Serviço rápido e muito profissional.', createdAt: '2025-11-20T08:30:00Z', user: { id: 'c1', name: 'Carlos' } }
      ]
    },
    {
      id: 's2',
      title: 'Instalação elétrica residencial',
      description: 'Troca de fiação, instalação de pontos e quadro elétrico',
      price: 200,
      deliveryTime: '2 dias',
      category: CategoryType.HomeServices,
      thumbnailUrl: '',
      freelancer: { id: 'u2', name: 'Mariana Costa', avatar: 'MC', rating: 4.9, reviews: 52 },
      reviews: [
        { id: 'r2', score: 5, comment: 'Excelente trabalho.', createdAt: '2025-11-10T15:00:00Z', user: { id: 'c2', name: 'Ana' } }
      ]
    },
    {
      id: 's3',
      title: 'Desenvolvimento de site institucional',
      description: 'Site responsivo com 5 páginas, SEO otimizado e painel admin',
      price: 1200,
      deliveryTime: '7 dias',
      category: CategoryType.Technology,
      thumbnailUrl: '',
      freelancer: { id: 'u3', name: 'Sarah Johnson', avatar: 'SJ', rating: 4.9, reviews: 127 },
      reviews: []
    },
    {
      id: 's4',
      title: 'Aulas particulares de Inglês',
      description: 'Aulas online individuais para todos os níveis, material incluso',
      price: 80,
      deliveryTime: '1 hora',
      category: CategoryType.Education,
      thumbnailUrl: '',
      freelancer: { id: 'u4', name: 'Michael Brown', avatar: 'MB', rating: 4.7, reviews: 89 },
      reviews: []
    },
    {
      id: 's5',
      title: 'Design de logotipo profissional',
      description: '3 conceitos iniciais, revisões ilimitadas, arquivos em alta resolução',
      price: 350,
      deliveryTime: '5 dias',
      category: CategoryType.CreativeArts,
      thumbnailUrl: '',
      freelancer: { id: 'u5', name: 'Isabella Rodrigues', avatar: 'IR', rating: 5.0, reviews: 156 },
      reviews: []
    },
    {
      id: 's6',
      title: 'Consultoria de marketing digital',
      description: 'Análise completa, estratégia de redes sociais e plano de ação',
      price: 600,
      deliveryTime: '7 dias',
      category: CategoryType.MarketingAndSales,
      thumbnailUrl: '',
      freelancer: { id: 'u6', name: 'Lucas Mendes', avatar: 'LM', rating: 4.8, reviews: 74 },
      reviews: []
    },
    {
      id: 's7',
      title: 'Tradução PT-EN profissional',
      description: 'Tradução certificada de documentos e textos técnicos',
      price: 150,
      deliveryTime: '3 dias',
      category: CategoryType.WritingAndTranslation,
      thumbnailUrl: '',
      freelancer: { id: 'u7', name: 'Amanda Santos', avatar: 'AS', rating: 4.9, reviews: 103 },
      reviews: []
    },
    {
      id: 's8',
      title: 'Personal trainer online',
      description: 'Treino personalizado, acompanhamento semanal e plano nutricional',
      price: 250,
      deliveryTime: '30 dias',
      category: CategoryType.HealthAndWellness,
      thumbnailUrl: '',
      freelancer: { id: 'u8', name: 'Rafael Oliveira', avatar: 'RO', rating: 4.8, reviews: 67 },
      reviews: []
    },
    {
      id: 's9',
      title: 'Manicure e pedicure domiciliar',
      description: 'Atendimento em domicílio com produtos profissionais',
      price: 60,
      deliveryTime: '1 hora',
      category: CategoryType.PersonalCare,
      thumbnailUrl: '',
      freelancer: { id: 'u9', name: 'Julia Lima', avatar: 'JL', rating: 4.9, reviews: 92 },
      reviews: []
    },
    {
      id: 's10',
      title: 'DJ para festas e eventos',
      description: 'Equipamento profissional, playlist personalizada, 4 horas',
      price: 800,
      deliveryTime: '1 dia',
      category: CategoryType.EventsAndEntertainment,
      thumbnailUrl: '',
      freelancer: { id: 'u10', name: 'Bruno Castro', avatar: 'BC', rating: 4.7, reviews: 134 },
      reviews: []
    },
    {
      id: 's11',
      title: 'Consultoria jurídica empresarial',
      description: 'Análise de contratos, parecer jurídico e orientação legal',
      price: 450,
      deliveryTime: '5 dias',
      category: CategoryType.LegalAndConsulting,
      thumbnailUrl: '',
      freelancer: { id: 'u11', name: 'Dr. Pedro Alves', avatar: 'PA', rating: 5.0, reviews: 54 },
      reviews: []
    },
    {
      id: 's12',
      title: 'Assessoria financeira pessoal',
      description: 'Planejamento financeiro, investimentos e controle de gastos',
      price: 380,
      deliveryTime: '7 dias',
      category: CategoryType.BusinessAndFinance,
      thumbnailUrl: '',
      freelancer: { id: 'u12', name: 'Fernanda Souza', avatar: 'FS', rating: 4.8, reviews: 78 },
      reviews: []
    }
  ];

  // Seed test freelancer and service for local testing
  // Freelancer userId 2001, client userId 1001
  constructor() {
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
      title: 'Serviço de Teste - Limpeza Residencial',
      description: 'Serviço completo de limpeza criado para teste entre contas mock.',
      price: 150,
      deliveryTime: '2 dias',
      category: CategoryType.HomeServices,
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

  getFeaturedServices() {
    return of(this.services.slice(0, 3)).pipe(delay(300));
  }

  searchServices(query = '', category?: string, page = 1, perPage = 12) {
    return this.searchServicesWithParams({ q: query, category, page, perPage });
  }

  /**
   * Nova versão de busca que aceita um objeto de filtros.
   * Prepara o método para futura integração com backend real.
   */
  searchServicesWithParams(params: {
    q?: string;
    category?: string;
    page?: number;
    perPage?: number;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    deliveryTime?: string; // ex: '1 dia', '7 dias'
    sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
    onlyAvailable?: boolean;
  }) {
    const q = (params.q || '').toLowerCase();
    let results = this.services.filter((s) => {
      return (
        (s.title || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q) ||
        (s.freelancer?.name || '').toLowerCase().includes(q)
      );
    });

    if (params.category) {
      results = results.filter((s) => s.category === params.category);
    }
    if (typeof params.minPrice === 'number') {
      results = results.filter((s) => typeof s.price === 'number' && s.price >= params.minPrice!);
    }
    if (typeof params.maxPrice === 'number') {
      results = results.filter((s) => typeof s.price === 'number' && s.price <= params.maxPrice!);
    }
    if (typeof params.minRating === 'number') {
      results = results.filter((s) => typeof s.freelancer?.rating === 'number' && (s.freelancer!.rating! >= params.minRating!));
    }
    if (params.deliveryTime) {
      // simple match: includes string (backend may use enum/number, mapping will be done in integration)
      results = results.filter((s) => (s.deliveryTime || '').toLowerCase().includes(params.deliveryTime!.toLowerCase()));
    }

    // Sorting
    if (params.sortBy) {
      if (params.sortBy === 'price_asc') results = results.sort((a, b) => (a.price || 0) - (b.price || 0));
      if (params.sortBy === 'price_desc') results = results.sort((a, b) => (b.price || 0) - (a.price || 0));
      if (params.sortBy === 'rating_desc') results = results.sort((a, b) => (b.freelancer?.rating || 0) - (a.freelancer?.rating || 0));
      if (params.sortBy === 'newest') results = results; // mock already pushes newest first
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
      title: payload.title || svc.title || 'Solicita\u00e7\u00e3o de Servi\u00e7o',
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
  createFreelancerForUser(userId: string | number, payload: { title?: string; bio?: string; skills?: string[]; hourlyRate?: number; categories?: string[]; portfolioUrl?: string; location?: string }) {
    const id = `fr_${this.nextFreelancerId++}`;
    const item = {
      id,
      userId,
      ...payload,
      createdAt: new Date().toISOString()
    };
    this.freelancers.unshift(item as any);
    return of(item).pipe(delay(200));
  }

  updateFreelancer(id: string | number, payload: { title?: string; bio?: string; skills?: string[]; hourlyRate?: number; categories?: string[]; portfolioUrl?: string; location?: string }) {
    const idx = this.freelancers.findIndex((x) => x.id == id);
    if (idx === -1) return of(null).pipe(delay(120));
    const updated = { ...this.freelancers[idx], ...payload } as any;
    this.freelancers[idx] = updated;
    return of(updated).pipe(delay(150));
  }

  createServiceForFreelancer(freelancerId: string | number, payload: { title: string; description?: string; price?: number; deliveryTime?: string; category?: string; thumbnailUrl?: string; }) {
    // create a service and attach the freelancer meta
    const id = `s${this.nextServiceId++}`;
    const svc: ServiceItem = {
      id,
      title: payload.title,
      description: payload.description || '',
      price: payload.price,
      deliveryTime: payload.deliveryTime,
      category: payload.category,
      thumbnailUrl: payload.thumbnailUrl || '',
      freelancer: { id: freelancerId, name: 'Você', avatar: '', rating: undefined, reviews: undefined },
      reviews: []
    } as ServiceItem;

    // push to the beginning of services
    this.services.unshift(svc);
    return of(svc).pipe(delay(150));
  }

  getServicesByFreelancerId(freelancerId: string | number) {
    const list = this.services.filter((s) => s.freelancer && s.freelancer.id == freelancerId);
    return of(list).pipe(delay(150));
  }

  getFreelancerById(id: string | number) {
    const f = this.freelancers.find((x) => x.id == id) || null;
    return of(f).pipe(delay(150));
  }

  getFreelancerByUserId(userId: string | number) {
    const f = this.freelancers.find((x) => x.userId == userId) || null;
    return of(f).pipe(delay(150));
  }
}
