import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  currentUser: User | null = null;
  unreadMessages = 3;
  private destroy$ = new Subject<void>();

  navLinks = [
    { label: 'Explorar Freelancers', path: '/browse' },
    { label: 'Como Funciona', path: '/how-it-works' },
    { label: 'Seja Freelancer', path: '/become-freelancer' },
  ];

  // Links dinâmicos baseados no tipo de usuário
  get userLinks() {
    if (!this.currentUser) return [];
    
    const links = [
      { label: 'Perfil', path: '/profile' },
    ];

    // Se for freelancer, mostra "Trabalhos"
    if (this.isFreelancer) {
      links.push({ label: 'Meus Trabalhos', path: '/my-jobs' });
    }

    // Todos usuários podem fazer pedidos
    links.push({ label: 'Meus Pedidos', path: '/my-requests' });

    return links;
  }

  get isFreelancer(): boolean {
    return !!this.currentUser?.isFreelancer;
  }

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscrever ao usuário atual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMobile() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  go(path: string) {
    this.router.navigateByUrl(path);
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.mobileMenuOpen = false;
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}
