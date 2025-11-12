import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
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
    { label: 'Explorar Serviços', path: '/browse' },
    { label: 'Como Funciona', path: '/#how-it-works' },
    { label: 'Seja Freelancer', path: '/create-service' },
  ];

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
