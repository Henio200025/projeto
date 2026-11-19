import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { AddressDTO, PhoneDTO, LoginRequest, LoginResponse, User, UserDTO } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_BASE = '/api';
  // Toggle local mock auth for development/demo. Set to `false` to use real API.
  private readonly USE_MOCK = false;
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
   * Token contém: userId, name, email, roles, sub
   */
  private decodeJwtToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('JWT Payload:', payload); // Debug
      const roles = Array.isArray(payload.roles) ? payload.roles.map((r: string) => String(r)) : [];
      const hasFreelancerRole = roles.some((r: string) => r.toUpperCase().includes('FREELANCER'));
      const normalizedRole = hasFreelancerRole
        ? 'FREELANCER'
        : (roles[0]?.toUpperCase().replace('ROLE_', '') || 'USER');

      return {
        id: payload.userId || payload.sub || 0,
        name: payload.name || payload.email || 'Usuário',
        email: payload.email || payload.sub || '',
        role: normalizedRole,
        isFreelancer: hasFreelancerRole
      };
    } catch (e) {
      console.error('Erro ao decodificar JWT:', e);
      // Fallback se decodificação falhar
      return {
        id: 0,
        name: 'Usuário',
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
   * Buscar dados atualizados do usuário logado do backend
   */
  refreshCurrentUser(): Observable<User> {
    const currentUser = this.currentUserValue;
    if (!currentUser) {
      return throwError(() => new Error('No user logged in'));
    }
    
    return this.http.get<any>(`/api/users/${currentUser.id}`).pipe(
      map(response => {
        // Normalizar role e flag de freelancer mesmo que o backend não envie o campo explicitamente
        const roleFromApi = String(response.role || '').toUpperCase();
        const isFreelancer =
          !!response.isFreelancer ||
          roleFromApi === 'FREELANCER' ||
          (Array.isArray(response.roles) && response.roles.map((r: string) => r.toUpperCase()).includes('FREELANCER'));

        const user: User = {
          ...response,
          role: response.role || (isFreelancer ? 'FREELANCER' : 'USER'),
          isFreelancer,
          phones: response.phoneDTO || response.phones || []
        };

        return user;
      }),
      tap(user => {
        this.setLocalStorage('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Registrar novo usuário
  * Backend Java: POST /api/users/create
   */
  register(
    name: string,
    email: string,
    password: string,
    addressDTO: AddressDTO[] = [],
    phoneDTO: PhoneDTO[] = []
  ): Observable<LoginResponse> {
    const payload: UserDTO = {
      id: 0,
      name,
      email,
      password,
      isFreelancer: false,
      addressDTO,
      phoneDTO
    };

    // Backend retorna UserDTO (não retorna token). Após criar, fazemos login para obter JWT.
    return this.http.post<UserDTO>(`${this.API_BASE}/users/create`, payload).pipe(
      switchMap(() => this.login(email, password))
    );
  }
}
