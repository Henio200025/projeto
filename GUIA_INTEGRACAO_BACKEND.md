# 🔌 Guia de Integração Backend - Uma Mãozinha

**Data:** Dezembro 2025  
**Repositório Backend:** https://github.com/ProgGusta/app-uma-maozinha-backend  
**Stack:** Angular 18 (Frontend) + Java Spring Boot (Backend)

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Mapeamento de DTOs e Enums](#mapeamento-de-dtos-e-enums)
3. [Configuração de Environment](#configuração-de-environment)
4. [Implementação de Services HTTP](#implementação-de-services-http)
5. [Autenticação JWT](#autenticação-jwt)
6. [Endpoints Disponíveis](#endpoints-disponíveis)
7. [Migração Mock → Backend Real](#migração-mock--backend-real)

---

## 🎯 Visão Geral

### Status Atual

✅ **Completado:**
- Frontend Angular 18 funcional com MockApiService
- Todos os DTOs TypeScript alinhados com backend Java
- Enums padronizados (CategoryType, ServiceRequestStatus)
- Sistema de autenticação JWT
- Fluxo completo de serviços e orçamentos
- Máscara de telefone e validações

⏳ **Pendente (Integração):**
- Configurar URL do backend em `environment.ts`
- Implementar `BackendApiService` com HTTP real
- Configurar interceptor JWT
- Testar endpoints com backend real
- Migrar componentes de Mock para HTTP

---

## 📦 Mapeamento de DTOs e Enums

### Enums Principais

#### CategoryType
```typescript
// frontend-angular/src/app/models/category.model.ts
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
```

#### ServiceRequestStatus
```typescript
// frontend-angular/src/app/models/service-request.model.ts
export enum ServiceRequestStatus {
  PENDING_BUDGET = 'PENDING_BUDGET',     // Aguardando orçamento
  BUDGETED = 'BUDGETED',                 // Orçamento enviado
  ACCEPTED = 'ACCEPTED',                 // Aceito pelo cliente
  REJECTED = 'REJECTED',                 // Rejeitado
  IN_PROGRESS = 'IN_PROGRESS',           // Em andamento
  COMPLETED = 'COMPLETED',               // Concluído
  CANCELLED = 'CANCELLED'                // Cancelado
}
```

### DTOs TypeScript → Java

| TypeScript (Frontend) | Java (Backend) | Arquivo TS |
|----------------------|----------------|------------|
| `User` | `UserDTO` | `user.model.ts` |
| `LoginRequest` | `LoginRequestDTO` | `auth.service.ts` |
| `ServiceRequestResponseDTO` | `ServiceRequestResponseDTO` | `service-request.model.ts` |
| `SendBudgetDTO` | `SendBudgetDTO` | `service-request.model.ts` |
| `RespondBudgetDTO` | `RespondBudgetDTO` | `service-request.model.ts` |

---

## ⚙️ Configuração de Environment

### 1. Development (src/environments/environment.development.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',  // URL do backend local
  useMockApi: true,  // true = usa mock, false = usa backend real
  mockDelay: 300     // ms de delay para simular latência
};
```

### 2. Production (src/environments/environment.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.umamanzinha.com.br/api',  // URL produção
  useMockApi: false,
  mockDelay: 0
};
```

---

## 🔧 Implementação de Services HTTP

### Criar BackendApiService

```typescript
// src/app/services/backend-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // ===== AUTENTICAÇÃO =====
  
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, { email, password });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData);
  }

  // ===== SERVICE REQUESTS =====
  
  createServiceRequest(data: any): Observable<any> {
    return this.http.post(
      `${this.API_URL}/service-requests`, 
      data, 
      { headers: this.getHeaders() }
    );
  }

  getMyRequests(filters?: any): Observable<any[]> {
    let params = new HttpParams();
    if (filters?.status) {
      filters.status.forEach((s: string) => {
        params = params.append('status', s);
      });
    }
    return this.http.get<any[]>(
      `${this.API_URL}/service-requests/my-requests`,
      { headers: this.getHeaders(), params }
    );
  }

  getMyJobs(filters?: any): Observable<any[]> {
    let params = new HttpParams();
    if (filters?.status) {
      filters.status.forEach((s: string) => {
        params = params.append('status', s);
      });
    }
    return this.http.get<any[]>(
      `${this.API_URL}/service-requests/my-jobs`,
      { headers: this.getHeaders(), params }
    );
  }

  sendBudget(requestId: number, budget: any): Observable<any> {
    return this.http.post(
      `${this.API_URL}/service-requests/${requestId}/budget`,
      budget,
      { headers: this.getHeaders() }
    );
  }

  respondBudget(requestId: number, response: any): Observable<any> {
    return this.http.post(
      `${this.API_URL}/service-requests/${requestId}/respond`,
      response,
      { headers: this.getHeaders() }
    );
  }

  startWork(requestId: number): Observable<any> {
    return this.http.patch(
      `${this.API_URL}/service-requests/${requestId}/start`,
      {},
      { headers: this.getHeaders() }
    );
  }

  completeWork(requestId: number): Observable<any> {
    return this.http.patch(
      `${this.API_URL}/service-requests/${requestId}/complete`,
      {},
      { headers: this.getHeaders() }
    );
  }
}
```

---

## 🔐 Autenticação JWT

### HTTP Interceptor (Já Implementado)

```typescript
// src/app/services/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

### Configuração no app.config.ts

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    // ...outros providers
  ]
};
```

---

## 📡 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Service Requests (Pedidos de Serviço)
- `POST /api/service-requests` - Criar pedido
- `GET /api/service-requests/my-requests` - Listar meus pedidos (cliente)
- `GET /api/service-requests/my-jobs` - Listar meus trabalhos (freelancer)
- `GET /api/service-requests/{id}` - Buscar por ID
- `POST /api/service-requests/{id}/budget` - Enviar orçamento (freelancer)
- `PUT /api/service-requests/{id}/budget` - Atualizar orçamento
- `POST /api/service-requests/{id}/respond` - Aceitar/Rejeitar orçamento (cliente)
- `PATCH /api/service-requests/{id}/start` - Iniciar trabalho (freelancer)
- `PATCH /api/service-requests/{id}/complete` - Concluir trabalho (freelancer)
- `PATCH /api/service-requests/{id}/cancel` - Cancelar pedido

### Serviços (Services)
- `GET /api/services` - Listar serviços
- `GET /api/services/search?query=...&category=...` - Buscar serviços
- `POST /api/services` - Criar serviço (freelancer)
- `PUT /api/services/{id}` - Atualizar serviço
- `DELETE /api/services/{id}` - Deletar serviço

---

## 🔄 Migração Mock → Backend Real

### Passo 1: Alterar Environment

```typescript
// environment.development.ts
export const environment = {
  useMockApi: false,  // ← Alterar para false
  apiUrl: 'http://localhost:8080/api'
};
```

### Passo 2: Substituir MockApiService

**ANTES:**
```typescript
import { MockApiService } from '../../services/mock-api.service';

export class MyRequestsComponent {
  constructor(private mockApi: MockApiService) {}

  loadRequests() {
    this.mockApi.getMyRequests().subscribe(data => {
      // ...
    });
  }
}
```

**DEPOIS:**
```typescript
import { BackendApiService } from '../../services/backend-api.service';

export class MyRequestsComponent {
  constructor(private backendApi: BackendApiService) {}

  loadRequests() {
    this.backendApi.getMyRequests().subscribe(data => {
      // ...
    });
  }
}
```

### Passo 3: Testar Gradualmente

1. Mantenha `useMockApi: true` durante desenvolvimento
2. Implemente um service por vez
3. Compare respostas Mock vs Backend
4. Ajuste mapeamentos se necessário
5. Quando tudo estiver funcionando, altere `useMockApi: false`

---

## 🧪 Testes de Integração

### Checklist de Validação

- [ ] Login com usuário válido retorna token JWT
- [ ] Token é anexado automaticamente nos requests
- [ ] Criar pedido de serviço funciona
- [ ] Listar pedidos retorna dados corretos
- [ ] Enviar orçamento atualiza status para BUDGETED
- [ ] Aceitar orçamento compartilha telefone do cliente
- [ ] Fluxo completo: Criar → Orçar → Aceitar → Iniciar → Concluir

### Ferramentas Recomendadas

- **Postman/Insomnia**: Testar endpoints isoladamente
- **Chrome DevTools**: Inspecionar Network tab
- **Angular DevTools**: Verificar estado dos componentes

---

## 🚀 Próximos Passos

1. **Backend em Execução**
   ```bash
   cd app-uma-maozinha-backend
   mvn spring-boot:run
   ```

2. **Implementar BackendApiService**
   - Copiar template acima
   - Adicionar todos os endpoints necessários

3. **Configurar CORS no Backend**
   ```java
   @Configuration
   public class CorsConfig {
     @Bean
     public WebMvcConfigurer corsConfigurer() {
       return new WebMvcConfigurer() {
         @Override
         public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/api/**")
             .allowedOrigins("http://localhost:4200")
             .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
             .allowedHeaders("*")
             .allowCredentials(true);
         }
       };
     }
   }
   ```

4. **Migrar Componentes Gradualmente**
   - Começar por autenticação (login/register)
   - Depois service requests
   - Por último, serviços e avaliações

5. **Monitorar Erros**
   - Console do navegador
   - Logs do Spring Boot
   - Status HTTP das requisições

---

## 📞 Suporte

- **Backend Repository**: https://github.com/ProgGusta/app-uma-maozinha-backend
- **Issues**: Reportar problemas no GitHub
- **Documentação Backend**: Ver README do repositório backend

---

**Última Atualização:** Dezembro 2025  
**Versão do Frontend:** Angular 18 com standalone components
