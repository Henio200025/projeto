import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-browse-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-services.component.html',
  styleUrls: ['./browse-services.component.css']
})
export class BrowseServicesComponent implements OnInit {
  searchQuery = '';
  sidebarOpen = false;
  showFilters = false;

  ngOnInit() {
    console.log('BrowseServicesComponent initialized');
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
    console.log('Pesquisando:', this.searchQuery);
    // Implementar lógica de busca aqui
  }
}