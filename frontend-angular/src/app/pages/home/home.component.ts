import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchQuery = '';

  categories = [
    { id: 1, name: 'Desenvolvimento Web', icon: '💻', count: 1250 },
    { id: 2, name: 'Apps Móveis', icon: '📱', count: 850 },
    { id: 3, name: 'Design & Criativo', icon: '🎨', count: 2100 },
    { id: 4, name: 'Redação & Conteúdo', icon: '✍️', count: 1650 },
  ];

  featuredServices = [
    { id: 1, title: 'Desenvolvimento Profissional de Sites', description: 'Desenvolvimento full-stack com tecnologias modernas', price: 2500, deliveryTime: '7 dias', category: 'Desenvolvimento Web', freelancer: { name: 'Sarah Johnson', avatar: 'SJ', rating: 4.9, reviews: 127 } },
    { id: 2, title: 'Design de UI/UX para Apps Móveis', description: 'Designs bonitos e intuitivos para apps móveis', price: 1800, deliveryTime: '5 dias', category: 'Design & Criativo', freelancer: { name: 'Michael Chen', avatar: 'MC', rating: 5.0, reviews: 89 } },
  ];

  constructor(public router: Router) {}

  onSearch(e: Event) {
    e.preventDefault();
    this.router.navigateByUrl(`/browse?q=${encodeURIComponent(this.searchQuery)}`);
  }
}
