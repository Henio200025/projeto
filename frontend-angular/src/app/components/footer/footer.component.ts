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
    Product: [
      { label: 'Browse Freelancers', path: '/browse' },
      { label: 'How It Works', path: '/#how-it-works' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Enterprise', path: '/enterprise' },
    ],
    Company: [
      { label: 'About Us', path: '/about' },
      { label: 'Careers', path: '/careers' },
      { label: 'Press', path: '/press' },
      { label: 'Contact', path: '/contact' },
    ],
    Resources: [
      { label: 'Blog', path: '/blog' },
      { label: 'Help Center', path: '/help' },
      { label: 'Community', path: '/community' },
      { label: 'API Docs', path: '/api' },
    ],
    Legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'Security', path: '/security' },
    ],
  } as Record<string, Array<{ label: string; path: string }>>;

  socialLinks = [
    { href: '#', label: 'Facebook' },
    { href: '#', label: 'Twitter' },
    { href: '#', label: 'Instagram' },
    { href: '#', label: 'LinkedIn' },
    { href: '#', label: 'GitHub' },
  ];
}
