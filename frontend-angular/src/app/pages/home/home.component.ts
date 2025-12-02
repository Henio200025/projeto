import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MockApiService, ServiceItem, Category } from '../../services/mock-api.service';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';

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
  featuredServices: ServiceItem[] = [];

  constructor(public router: Router, private api: MockApiService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    // carregar categorias e serviços em destaque via mock api
    this.api.getCategories().subscribe((c) => {
      this.categories = c;
      this.cd.markForCheck();
    });
    this.api.getFeaturedServices().subscribe((s) => {
      this.featuredServices = s;
      this.cd.markForCheck();
    });
  }

  onSearch(e: Event) {
    e.preventDefault();
    this.router.navigateByUrl(`/browse?q=${encodeURIComponent(this.searchQuery)}`);
  }
}
