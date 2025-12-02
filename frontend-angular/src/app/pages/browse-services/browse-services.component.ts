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
    this.api.searchServices(this.searchQuery || '', this.selectedCategory || undefined, this.page, this.perPage).subscribe((res: any) => {
      this.services = res.data || [];
      this.total = res.meta?.total || this.services.length;
      this.loading = false;
      // notify change detection because zoneless scheduler won't pick up this async assignment
      this.cd.markForCheck();
    });
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