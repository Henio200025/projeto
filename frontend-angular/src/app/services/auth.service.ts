import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

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
   * Backend Java retorna: { token: string, expiresIn: number }
   * Extraímos o user do JWT token
   */
  login(email: string, password: string): Observable<LoginResponse> {
    if (this.USE_MOCK) {
      // Mock response para desenvolvimento local
      // support preset test accounts for easier local testing
      let user: User;
      if (email === 'client@test' || email === 'cliente@test.com') {
        user = { id: 1001, name: 'Cliente Test', email, role: 'USER' } as User;
      } else if (email === 'freelancer@test' || email === 'freelancer@test.com') {
        user = { id: 2001, name: 'Freelancer Test', email, role: 'freelancer', isFreelancer: true } as User;
      } else {
        user = { id: 1, name: 'Usuário Mock', email, role: 'USER' } as User;
      }
      const mock: LoginResponse = { 
        token: 'mock-jwt-token', 
        expiresIn: 3600000 // 1 hora em ms
      };
      this.setLocalStorage('authToken', mock.token);
      this.setLocalStorage('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(mock).pipe(delay(250));
    }
    
    const loginReq: LoginRequest = { email, password };
    return this.http
      .post<LoginResponse>(`${this.API_BASE}/login`, loginReq)
      .pipe(
        map((response) => {
          // Salvar token
          this.setLocalStorage('authToken', response.token);
          
          // Decodificar JWT para obter user info (simplificado)
          // Em produção, usar uma lib como jwt-decode
          const user = this.decodeJwtToken(response.token);
          
          this.setLocalStorage('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return response;
        })
      );
  }

  /**
   * Decodificar JWT token (simplificado)
   * Em produção, usar jwt-decode library
   */
  private decodeJwtToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId || 0,
        name: payload.name || payload.email,
        email: payload.email || payload.sub,
        role: payload.roles || 'USER',
        isFreelancer: payload.roles?.includes('FREELANCER') || false
      };
    } catch (e) {
      // Fallback se decodificação falhar
      return {
        id: 0,
        name: 'User',
        email: '',
        role: 'USER',
        isFreelancer: false
      };
    }
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
  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  /**
   * Verificar se é freelancer
   */
  isFreelancer(): boolean {
    const role = String(this.currentUserValue?.role || '').toLowerCase();
    return role === 'freelancer' || !!this.currentUserValue?.isFreelancer;
  }

  /**
   * Verificar se é usuário comum
   */
  isUser(): boolean {
    return this.currentUserValue?.role === 'USER';
  }

  /**
   * Atualizar o usuário atual
   */
  updateCurrentUser(user: User): void {
    this.setLocalStorage('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  /**
   * Registrar novo usuário
   * Backend Java: POST /api/register
   */
  register(email: string, password: string, role: string = 'USER'): Observable<LoginResponse> {
    if (this.USE_MOCK) {
      const user: User = { 
        id: Math.floor(Math.random() * 10000), 
        name: email.split('@')[0],
        email, 
        role,
        isFreelancer: role === 'FREELANCER'
      };
      const mock: LoginResponse = { 
        token: 'mock-jwt-token', 
        expiresIn: 3600000 
      };
      this.setLocalStorage('authToken', mock.token);
      this.setLocalStorage('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(mock).pipe(delay(250));
    }
    
    return this.http
      .post<LoginResponse>(`${this.API_BASE}/register`, { email, password, role })
      .pipe(
        map((response) => {
          this.setLocalStorage('authToken', response.token);
          const user = this.decodeJwtToken(response.token);
          this.setLocalStorage('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return response;
        })
      );
  }
}
