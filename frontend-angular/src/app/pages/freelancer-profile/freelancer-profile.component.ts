import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { MockApiService } from '../../services/mock-api.service';


@Component({
  selector: 'app-freelancer-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div *ngIf="loading" class="p-6 bg-muted rounded animate-pulse">Carregando perfil...</div>

      <div *ngIf="!loading && freelancer" class="bg-white border rounded p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">{{ freelancer.title?.charAt(0) || 'F' }}</div>
          <div>
            <h2 class="text-xl font-bold">{{ freelancer.title }}</h2>
            <div class="text-sm text-muted-foreground">{{ freelancer.location }}</div>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="font-semibold mb-2">Sobre</h3>
          <p class="text-sm text-muted-foreground">{{ freelancer.bio }}</p>
        </div>

        <div class="mb-4">
          <h3 class="font-semibold mb-2">Skills</h3>
          <div class="flex gap-2 flex-wrap">
            <span *ngFor="let s of freelancer.skills || []" class="px-2 py-1 border rounded text-sm">{{ s }}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p class="text-xs text-muted-foreground">Valor/hora</p>
            <div class="text-lg font-bold">R$ {{ freelancer.hourlyRate || '—' }}</div>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Categorias</p>
            <div class="text-sm">{{ (freelancer.categories || []).join(', ') || '—' }}</div>
          </div>
        </div>

        <div *ngIf="freelancer.portfolioUrl" class="mt-6">
          <a [href]="freelancer.portfolioUrl" target="_blank" class="text-primary hover:underline">Portfólio / Site</a>
        </div>
        <!-- Public services list (if any) -->
        <div class="mt-8">
          <h3 class="font-semibold mb-3">Serviços</h3>
          <div *ngIf="servicesLoading" class="p-4 bg-muted rounded animate-pulse">Carregando serviços...</div>
          <div *ngIf="!servicesLoading && services.length === 0" class="text-sm text-muted-foreground">Nenhum serviço público encontrado.</div>
          <div *ngIf="!servicesLoading && services.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div *ngFor="let s of services" class="border rounded p-4 bg-white">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-semibold">{{ s.title }}</div>
                  <div class="text-sm text-muted-foreground">{{ s.category }}</div>
                </div>
                <div class="text-lg font-bold">R$ {{ s.price || '—' }}</div>
              </div>
              <p class="text-sm text-muted-foreground mt-2">{{ s.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !freelancer" class="p-6 bg-muted rounded text-center">
        <div class="text-sm text-muted-foreground">Perfil de freelancer não encontrado.</div>
      </div>
    </div>
  `,
  styles: []
})
export class FreelancerProfileComponent {
  freelancer: any = null;
  loading = false;
  services: any[] = [];
  servicesLoading = false;

  constructor(private route: ActivatedRoute, private api: MockApiService, private cd: ChangeDetectorRef) {
    // Get the freelancer ID from route params
    this.route.params.subscribe(params => {
      const freelancerId = params['id'];
      // Fetch freelancer details using the ID
      this.loading = true;
      this.api.getFreelancerById(freelancerId).subscribe((f: any) => {
        this.freelancer = f;
        this.loading = false;
        try { this.cd.markForCheck(); } catch (e) {}

        // also fetch services associated with this freelancer (public profile)
        this.servicesLoading = true;
        this.api.getServicesByFreelancerId(freelancerId).subscribe((list: any) => {
          this.services = list || [];
          this.servicesLoading = false;
          try { this.cd.markForCheck(); } catch (e) {}
        });
      });
    });
  }
}