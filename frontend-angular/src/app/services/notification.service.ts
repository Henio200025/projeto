import { Injectable, signal, inject } from '@angular/core';
import { AuthService } from './auth.service';

export interface Notification {
  id: string;
  type: 'budget_received' | 'budget_accepted' | 'budget_rejected' | 'work_started' | 'work_completed' | 'new_request';
  title: string;
  message: string;
  requestId: string | number;
  timestamp: Date;
  read: boolean;
  icon: string;
  color: string;
  targetRole: 'client' | 'freelancer'; // Para quem a notificação é destinada
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private authService = inject(AuthService);
  private notifications = signal<Notification[]>([]);
  
  // Getters - filtrar notificações baseado no papel do usuário
  getNotifications = () => {
    const currentUser = this.authService.currentUserValue;
    const isFreelancer = currentUser?.isFreelancer || false;
    const role: 'client' | 'freelancer' = isFreelancer ? 'freelancer' : 'client';
    
    return this.notifications().filter(n => n.targetRole === role);
  };
  
  getUnreadCount = () => {
    return this.getNotifications().filter(n => !n.read).length;
  };

  // Adicionar notificação
  addNotification(type: Notification['type'], requestId: string | number, requestTitle?: string) {
    const notification = this.createNotification(type, requestId, requestTitle);
    this.notifications.update(current => [notification, ...current]);
    
    // Salvar no localStorage
    this.saveToStorage();
  }

  // Marcar como lida
  markAsRead(notificationId: string) {
    this.notifications.update(current => 
      current.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    this.saveToStorage();
  }

  // Marcar todas como lidas
  markAllAsRead() {
    this.notifications.update(current => 
      current.map(n => ({ ...n, read: true }))
    );
    this.saveToStorage();
  }

  // Remover notificação
  removeNotification(notificationId: string) {
    this.notifications.update(current => 
      current.filter(n => n.id !== notificationId)
    );
    this.saveToStorage();
  }

  // Limpar todas
  clearAll() {
    this.notifications.set([]);
    this.saveToStorage();
  }

  // Carregar do localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Converter strings de data de volta para Date
        const notifications = parsed
          .filter((n: any) => n.targetRole) // Filtrar notificações antigas sem targetRole
          .map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }));
        this.notifications.set(notifications);
      }
    } catch (e) {
      console.error('Erro ao carregar notificações:', e);
    }
  }

  // Salvar no localStorage
  private saveToStorage() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications()));
    } catch (e) {
      console.error('Erro ao salvar notificações:', e);
    }
  }

  // Criar notificação com base no tipo
  private createNotification(type: Notification['type'], requestId: string | number, requestTitle?: string): Notification {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();
    const title = requestTitle || `Pedido #${requestId}`;

    switch (type) {
      case 'new_request':
        // Notificação para FREELANCER quando cliente cria pedido
        return {
          id,
          type,
          title: '📝 Novo Pedido Recebido',
          message: `Você recebeu uma nova solicitação: ${title}`,
          requestId,
          timestamp,
          read: false,
          icon: '📝',
          color: 'blue',
          targetRole: 'freelancer'
        };

      case 'budget_received':
        // Notificação para CLIENTE quando freelancer envia orçamento
        return {
          id,
          type,
          title: '💰 Orçamento Recebido',
          message: `O freelancer enviou um orçamento para: ${title}`,
          requestId,
          timestamp,
          read: false,
          icon: '💰',
          color: 'green',
          targetRole: 'client'
        };

      case 'budget_accepted':
        // Notificação para FREELANCER quando cliente aceita
        return {
          id,
          type,
          title: '✅ Orçamento Aceito',
          message: `O cliente aceitou seu orçamento: ${title}`,
          requestId,
          timestamp,
          read: false,
          icon: '✅',
          color: 'green',
          targetRole: 'freelancer'
        };

      case 'budget_rejected':
        // Notificação para FREELANCER quando cliente rejeita
        return {
          id,
          type,
          title: '❌ Orçamento Rejeitado',
          message: `O cliente rejeitou o orçamento: ${title}`,
          requestId,
          timestamp,
          read: false,
          icon: '❌',
          color: 'red',
          targetRole: 'freelancer'
        };

      case 'work_started':
        // Notificação para CLIENTE quando freelancer inicia trabalho
        return {
          id,
          type,
          title: '🚀 Trabalho Iniciado',
          message: `O freelancer iniciou o trabalho: ${title}`,
          requestId,
          timestamp,
          read: false,
          icon: '🚀',
          color: 'purple',
          targetRole: 'client'
        };

      case 'work_completed':
        // Notificação para CLIENTE quando freelancer completa
        return {
          id,
          type,
          title: '🎉 Trabalho Concluído',
          message: `O trabalho foi concluído: ${title}`,
          requestId,
          timestamp,
          read: false,
          icon: '🎉',
          color: 'green',
          targetRole: 'client'
        };

      default:
        return {
          id,
          type,
          title: 'Notificação',
          message: `Atualização no pedido: ${title}`,
          requestId,
          timestamp,
          read: false,
          icon: '🔔',
          color: 'gray',
          targetRole: 'client'
        };
    }
  }
}
