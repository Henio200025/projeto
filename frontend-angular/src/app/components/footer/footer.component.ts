import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  footerLinks = {
    Produto: [
      { label: 'Explorar Freelancers', path: '/browse' },
      { label: 'Como Funciona', path: '/#how-it-works' },
      { label: 'Planos e Preços', path: '/pricing' },
      { label: 'Para Empresas', path: '/enterprise' },
    ],
    Empresa: [
      { label: 'Sobre Nós', path: '/about' },
      { label: 'Carreiras', path: '/careers' },
      { label: 'Imprensa', path: '/press' },
      { label: 'Contato', path: '/contact' },
    ],
    Recursos: [
      { label: 'Blog', path: '/blog' },
      { label: 'Central de Ajuda', path: '/help' },
      { label: 'Comunidade', path: '/community' },
      { label: 'Documentação da API', path: '/api' },
    ],
    Legal: [
      { label: 'Política de Privacidade', path: '/privacy' },
      { label: 'Termos de Uso', path: '/terms' },
      { label: 'Política de Cookies', path: '/cookies' },
      { label: 'Segurança', path: '/security' },
    ],
  } as Record<string, Array<{ label: string; path: string }>>;
}
