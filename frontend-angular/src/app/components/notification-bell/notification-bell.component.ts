import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {
  isOpen = signal(false);
  unreadCount = signal(0);

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {
    // Atualizar contador quando notificações mudarem
    effect(() => {
      this.unreadCount.set(this.notificationService.getUnreadCount());
    });
  }

  get notifications() {
    return this.notificationService.getNotifications;
  }

  ngOnInit() {
    // Carregar notificações do localStorage
    this.notificationService.loadFromStorage();
    
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-bell-container')) {
        this.isOpen.set(false);
      }
    });
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isOpen.update(v => !v);
  }

  markAsRead(notification: Notification, event: Event) {
    event.stopPropagation();
    if (!notification.read) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  removeNotification(notificationId: string, event: Event) {
    event.stopPropagation();
    this.notificationService.removeNotification(notificationId);
  }

  clearAll() {
    if (confirm('Deseja limpar todas as notificações?')) {
      this.notificationService.clearAll();
    }
  }

  goToRequest(notification: Notification) {
    this.markAsRead(notification, new Event('click'));
    this.isOpen.set(false);
    
    // Determinar para qual página ir baseado no papel do usuário
    const user = this.authService.currentUserValue;
    const isFreelancer = user?.isFreelancer || user?.role?.toLowerCase() === 'freelancer';
    
    if (isFreelancer) {
      this.router.navigate(['/my-jobs']);
    } else {
      this.router.navigate(['/my-requests']);
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return 'Agora';
  }

  getIconColor(color: string): string {
    const colors: Record<string, string> = {
      blue: '#dbeafe',
      green: '#dcfce7',
      red: '#fee2e2',
      purple: '#f3e8ff',
      gray: '#f1f5f9'
    };
    return colors[color] || colors['gray'];
  }
}
