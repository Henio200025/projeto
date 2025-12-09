import { Component, OnInit, ChangeDetectorRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MockApiService, FreelancerListItem } from '../../services/mock-api.service';
import { AuthService } from '../../services/auth.service';
import { RequestServiceModalComponent } from '../../components/request-service-modal/request-service-modal.component';
import { RatingDisplayComponent } from '../../components/rating-display/rating-display.component';
import { FreelancerResponseDTO } from '../../models/freelancer.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RequestServiceModalComponent, RatingDisplayComponent],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  service: FreelancerListItem | null = null;
  freelancerData: FreelancerResponseDTO | null = null;
  freelancerId: number | null = null;
  ratingCount = signal<number>(0);
  loading = true;
  showModal = signal(false);
  @ViewChild(RatingDisplayComponent) ratingDisplayComponent?: RatingDisplayComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: MockApiService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadService(id);
    } else {
      this.loading = false;
    }
  }

  loadService(id: string) {
    // Tentar carregar do backend primeiro (dados reais)
    this.api.getFreelancerById(id).subscribe({
      next: (freelancer) => {
        if (freelancer) {
          this.freelancerData = freelancer;
          this.freelancerId = freelancer.id || null;
          // Mapear dados do backend para FreelancerListItem
          this.service = {
            id: freelancer.id,
            title: freelancer.title,
            description: freelancer.description,
            category: freelancer.category?.name as any,
            averageRating: freelancer.averageRating ?? 0,
            userName: freelancer.user?.name || 'Freelancer'
          };
        }
        this.loading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar freelancer do backend, tentando mock:', err);
        // Fallback para mock
        this.api.getFreelancerCardById(id).subscribe({
          next: (service) => {
            if (service) {
              this.service = service;
              this.freelancerId = Number(service.id) || null;
            }
            this.loading = false;
            this.cd.markForCheck();
          },
          error: () => {
            console.error('Erro ao carregar freelancer');
            this.loading = false;
            this.cd.markForCheck();
          }
        });
      }
    });
  }

  requestService() {
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.service) {
      console.error('Service is null');
      alert('Erro: Serviço não carregado. Recarregue a página e tente novamente.');
      return;
    }

    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onRequestCreated() {
    this.showModal.set(false);
    // Redirecionar para a página de pedidos
    this.router.navigate(['/my-requests']);
  }

  goBack() {
    this.router.navigate(['/browse']);
  }

  /**
   * Atualizar contagem de avaliações quando o component de ratings carrega
   */
  updateRatingCount() {
    if (this.ratingDisplayComponent) {
      this.ratingCount.set(this.ratingDisplayComponent.ratings().length);
    }
  }
}
