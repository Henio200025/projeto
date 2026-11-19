import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockApiService, Category, FreelancerListItem } from '../../services/mock-api.service';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { FreelancerResponseDTO } from '../../models/freelancer.model';
import { CategoryType } from '../../models/enums';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceCardComponent, CategoryCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  categories: Category[] = [];
  featuredFreelancers: FreelancerListItem[] = [];
  popularCategories: { label: string; value: string }[] = [
    { label: 'Tecnologia', value: CategoryType.Technology },
    { label: 'Serviços Domésticos', value: CategoryType.HomeServices },
    { label: 'Saúde e Bem-estar', value: CategoryType.HealthAndWellness },
    { label: 'Educação', value: CategoryType.Education }
  ];

  constructor(public router: Router, private api: MockApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Categorias continuam vindo do mock até termos endpoint dedicado
    this.api.getCategories().subscribe((c) => {
      this.categories = c;
      this.cd.markForCheck();
    });

    // Buscar freelancers reais do backend e mapear para o card da home
    this.api.getFreelancersFromApi().subscribe({
      next: (data: FreelancerResponseDTO[]) => {
        this.featuredFreelancers = data.slice(0, 4).map((f) => ({
          id: f.id,
          title: f.title,
          description: f.description,
          category: (f.category?.name as CategoryType) || CategoryType.Other,
          averageRating: f.averageRating ?? 0,
          reviews: 0,
          userName: f.user?.name || 'Freelancer'
        }));
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar freelancers', err);
      }
    });
  }

  onSearch(e: Event) {
    e.preventDefault();
    this.router.navigateByUrl(`/browse?q=${encodeURIComponent(this.searchQuery)}`);
  }

  browseByCategory(categoryValue: string) {
    this.router.navigateByUrl(`/browse?category=${encodeURIComponent(categoryValue)}`);
  }
}

