import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'freelancer';
  nickname?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_BASE = '/api';
  // Toggle local mock auth for development/demo. Set to `false` to use real API.
  private readonly USE_MOCK = true;
  private platformId = inject(PLATFORM_ID);
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private http: HttpClient) {
    // Inicializar com o usuário armazenado em localStorage (se existir)
    let storedUser: User | null = null;
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('currentUser');
      storedUser = stored ? JSON.parse(stored) : null;
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  private setLocalStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  private getLocalStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeLocalStorage(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Fazer login com email e senha
   * Esperado: API retorna { access_token, token_type, user: { id, email, role } }
   */
  login(email: string, password: string): Observable<LoginResponse> {
    if (this.USE_MOCK) {
      // Simple mock response for local development
      const user = { id: 'u_mock', email, role: 'user' as const };
      const mock: LoginResponse = { access_token: 'mock-access-token', token_type: 'bearer', user };
      // mimic server delay
      this.setLocalStorage('authToken', mock.access_token);
      this.setLocalStorage('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(mock).pipe(delay(250));
    }
    return this.http
      .post<LoginResponse>(`${this.API_BASE}/login`, { email, password })
      .pipe(
        map((response) => {
          // Salvar token e usuário em localStorage
          this.setLocalStorage('authToken', response.access_token);
          this.setLocalStorage('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          return response;
        })
      );
  }

  /**
   * Fazer logout
   */
  logout(): void {
    // Remover do armazenamento local
    this.removeLocalStorage('authToken');
    this.removeLocalStorage('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Verificar se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getLocalStorage('authToken');
    return !!token && !!this.currentUserValue;
  }

  /**
   * Obter o token JWT armazenado
   */
  getToken(): string | null {
    return this.getLocalStorage('authToken');
  }

  /**
   * Verificar se o usuário tem um papel específico
   */
  hasRole(role: 'admin' | 'user' | 'freelancer'): boolean {
    return this.currentUserValue?.role === role;
  }

  /**
   * Atualizar o usuário atual
   */
  updateCurrentUser(user: User): void {
    this.setLocalStorage('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Registrar novo usuário (opcional, pode ser expandido)
   */
  register(email: string, password: string, role: 'admin' | 'user' | 'freelancer' = 'user'): Observable<LoginResponse> {
    if (this.USE_MOCK) {
      const user = { id: `u_${Math.floor(Math.random() * 10000)}`, email, role } as any;
      const mock: LoginResponse = { access_token: 'mock-access-token', token_type: 'bearer', user };
      this.setLocalStorage('authToken', mock.access_token);
      this.setLocalStorage('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(mock).pipe(delay(250));
    }
    return this.http
      .post<LoginResponse>(`${this.API_BASE}/register`, { email, password, role })
      .pipe(
        map((response) => {
          this.setLocalStorage('authToken', response.access_token);
          this.setLocalStorage('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          return response;
        })
      );
  }
}
