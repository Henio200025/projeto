import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockApiService, ServiceItem, Category } from '../../services/mock-api.service';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';
import { Router } from '@angular/router';

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
  services: ServiceItem[] = [];
  categories: Category[] = [];
  page = 1;
  perPage = 12;
  total = 0;
  selectedCategory?: string | null = null;

  // filtros locais prontos para integração com backend
  filters: {
    minPrice?: number | null;
    maxPrice?: number | null;
    minRating?: number | null;
    deliveryTime?: string | null;
    sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest' | null;
    onlyAvailable?: boolean;
  } = {
    minPrice: null,
    maxPrice: null,
    minRating: null,
    deliveryTime: null,
    sortBy: null,
    onlyAvailable: false
  };

  constructor(private api: MockApiService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    // carregar categorias e os primeiros resultados de serviços
    this.api.getCategories().subscribe((c) => {
      this.categories = c;
      // app is configured for zoneless change detection — explicitly mark for check
      this.cd.markForCheck();
    });
    this.loadServices();
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
    const params: any = {
      q: this.searchQuery || undefined,
      category: this.selectedCategory || undefined,
      page: this.page,
      perPage: this.perPage,
      minPrice: this.filters.minPrice || undefined,
      maxPrice: this.filters.maxPrice || undefined,
      minRating: this.filters.minRating || undefined,
      deliveryTime: this.filters.deliveryTime || undefined,
      sortBy: this.filters.sortBy || undefined,
      onlyAvailable: this.filters.onlyAvailable || undefined
    };

    this.api.searchServicesWithParams(params).subscribe((res: any) => {
      this.services = res.data || [];
      this.total = res.meta?.total || this.services.length;
      this.loading = false;
      // notify change detection because zoneless scheduler won't pick up this async assignment
      this.cd.markForCheck();
    });
  }

  applyFilters() {
    this.page = 1;
    this.loadServices();
    this.showFilters = false;
  }

  clearFilters() {
    this.filters = { minPrice: null, maxPrice: null, minRating: null, deliveryTime: null, sortBy: null, onlyAvailable: false };
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
    this.router.navigateByUrl(`/service/${id}`);
  }
}