import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  status?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class MockApiService {
  private categories: Category[] = [
    { id: 1, name: 'Desenvolvimento Web', icon: '💻', count: 1250 },
    { id: 2, name: 'Apps Móveis', icon: '📱', count: 850 },
    { id: 3, name: 'Design & Criativo', icon: '🎨', count: 2100 },
    { id: 4, name: 'Redação & Conteúdo', icon: '✍️', count: 1650 },
    { id: 5, name: 'Serviços Domésticos', icon: '🧰', count: 900 }
  ];

  private services: ServiceItem[] = [
    {
      id: 's1',
      title: 'Reparo hidráulico rápido',
      description: 'Conserto de vazamentos e substituição de válvulas',
      price: 120,
      deliveryTime: '1 dia',
      category: 'Serviços Domésticos',
      thumbnailUrl: '',
      freelancer: { id: 'u1', name: 'João Silva', avatar: 'JS', rating: 4.8, reviews: 34 },
      // no images returned by API — placeholder will be used in UI
      reviews: [
        { id: 'r1', score: 5, comment: 'Serviço rápido e muito profissional.', createdAt: '2025-11-20T08:30:00Z', user: { id: 'c1', name: 'Carlos' } }
      ]
    },
    {
      id: 's2',
      title: 'Instalação elétrica residencial',
      description: 'Troca de fiação e instalação de pontos',
      price: 200,
      deliveryTime: '2 dias',
      category: 'Serviços Domésticos',
      thumbnailUrl: '',
      freelancer: { id: 'u2', name: 'Mariana Costa', avatar: 'MC', rating: 4.9, reviews: 52 },
      // no images returned by API — placeholder will be used in UI
      reviews: [
        { id: 'r2', score: 5, comment: 'Excelente trabalho.', createdAt: '2025-11-10T15:00:00Z', user: { id: 'c2', name: 'Ana' } }
      ]
    },
    {
      id: 's3',
      title: 'Criação de site institucional',
      description: 'Site responsivo com 5 páginas',
      price: 1200,
      deliveryTime: '7 dias',
      category: 'Desenvolvimento Web',
      thumbnailUrl: '',
      freelancer: { id: 'u3', name: 'Sarah Johnson', avatar: 'SJ', rating: 4.9, reviews: 127 },
      // no images returned by API — placeholder will be used in UI
      reviews: []
    }
  ];

  private nextReviewId = 100;
  private nextRequestId = 500;

  private requests: Array<{ id: string; serviceId: string | number; user: { id: string; name: string }; message?: string; status?: string; createdAt?: string }> = [];

  getCategories() {
    return of(this.categories).pipe(delay(200));
  }

  getFeaturedServices() {
    return of(this.services.slice(0, 3)).pipe(delay(300));
  }

  searchServices(query = '', category?: string, page = 1, perPage = 12) {
    let results = this.services.filter((s) => {
      const q = query.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q)
      );
    });
    if (category) {
      results = results.filter((s) => s.category === category);
    }

    const start = (page - 1) * perPage;
    const data = results.slice(start, start + perPage);

    const meta = { page, perPage, total: results.length };
    return of({ data, meta }).pipe(delay(200));
  }

  getServiceById(id: string | number) {
    const item = this.services.find((s) => s.id == id);
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
  postRequest(serviceId: string | number, payload: { user: { id: string; name: string }; message?: string }): import('rxjs').Observable<RequestItem | null> {
    const svc = this.services.find((s) => s.id == serviceId);
    if (!svc) return of(null as RequestItem | null).pipe(delay(100));

    const req = {
      id: `req${this.nextRequestId++}`,
      serviceId: serviceId as any,
      user: payload.user,
      message: payload.message || '',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.requests.unshift(req);
    return of(req as RequestItem).pipe(delay(150));
  }

  getRequestsByUser(userId: string) {
    const list = this.requests.filter((r) => r.user?.id === userId);
    return of(list).pipe(delay(100));
  }
}
