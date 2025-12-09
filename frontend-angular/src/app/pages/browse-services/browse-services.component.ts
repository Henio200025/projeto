import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockApiService, Category, FreelancerListItem } from '../../services/mock-api.service';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-browse-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ServiceCardComponent, CategoryCardComponent],
  templateUrl: './browse-services.component.html',
  styleUrls: ['./browse-services.component.css']
})
export class BrowseServicesComponent implements OnInit {
  searchQuery = '';
  sidebarOpen = false;
  showFilters = false;
  loading = false;
  freelancers: FreelancerListItem[] = [];
  categories: Category[] = [];
  page = 1;
  perPage = 12;
  total = 0;
  selectedCategory?: string | null = null;

  // filtros locais prontos para integração com backend
  filters: {
    minRating?: number | null;
  } = {
    minRating: null
  };

  constructor(private api: MockApiService, private router: Router, private activatedRoute: ActivatedRoute, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    // Ler parâmetros de query da URL (category, q)
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        console.log('Categoria selecionada de URL:', this.selectedCategory);
      }
      if (params['q']) {
        this.searchQuery = params['q'];
      }
      // carregar categorias e os primeiros resultados de serviços
      this.api.getCategories().subscribe((c) => {
        this.categories = c;
        // app is configured for zoneless change detection — explicitly mark for check
        this.cd.markForCheck();
      });
      this.loadServices();
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    console.log('Sidebar:', this.sidebarOpen);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    console.log('Filters:', this.showFilters);
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.page = 1;
    this.loadServices();
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat.name;
    this.page = 1;
    this.loadServices();
  }

  clearCategory() {
    this.selectedCategory = null;
    this.page = 1;
    this.loadServices();
  }

  loadServices() {
    this.loading = true;

    this.api.getFreelancersFromApi().subscribe({
      next: (res) => {
        const mapped = (res || []).map((f) => ({
          id: f.id,
          title: f.title,
          description: f.description,
          category: f.category?.name,
          averageRating: f.averageRating ?? 0,
          userName: f.user?.name || 'Freelancer'
        }) as FreelancerListItem);

        // filtros client-side
        let results = mapped;
        const q = (this.searchQuery || '').toLowerCase();
        if (q) {
          results = results.filter((item) =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.userName.toLowerCase().includes(q)
          );
        }
        if (this.selectedCategory) {
          results = results.filter((item) => String(item.category) === String(this.selectedCategory));
        }
        if (this.filters.minRating) {
          results = results.filter((item) => item.averageRating >= (this.filters.minRating || 0));
        }

        this.total = results.length;
        const start = (this.page - 1) * this.perPage;
        this.freelancers = results.slice(start, start + this.perPage);
        this.loading = false;
        this.cd.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.freelancers = [];
        this.total = 0;
        this.cd.markForCheck();
      }
    });
  }

  applyFilters() {
    this.page = 1;
    this.loadServices();
    this.showFilters = false;
  }

  clearFilters() {
    this.filters = { minRating: null };
    this.page = 1;
    this.loadServices();
  }

  changePage(next: boolean) {
    if (next) {
      if (this.page * this.perPage < this.total) {
        this.page += 1;
        this.loadServices();
      }
    } else {
      if (this.page > 1) {
        this.page -= 1;
        this.loadServices();
      }
    }
  }

  goToService(id: string | number) {
    this.router.navigateByUrl(`/freelancer/${id}`);
  }
}