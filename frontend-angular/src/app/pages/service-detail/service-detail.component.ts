import { Component, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MockApiService, ServiceItem } from '../../services/mock-api.service';
import { AuthService } from '../../services/auth.service';
import { RequestServiceModalComponent } from '../../components/request-service-modal/request-service-modal.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, RequestServiceModalComponent],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  service: ServiceItem | null = null;
  loading = true;
  isOwner = false;
  showModal = signal(false);

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
    this.api.getServiceById(id).subscribe({
      next: (service) => {
        this.service = service;
        this.loading = false;
        
        // Verificar se o usuário é o dono do serviço
        const currentUser = this.authService.currentUserValue;
        console.log('Current user:', currentUser);
        console.log('Service freelancer:', service?.freelancer);
        
        if (service && service.freelancer && currentUser) {
          this.isOwner = String(currentUser.id) === String(service.freelancer.userId);
          console.log('IsOwner check:', {
            currentUserId: currentUser.id,
            freelancerUserId: service.freelancer.userId,
            isOwner: this.isOwner
          });
        } else {
          this.isOwner = false;
        }
        
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error loading service:', err);
        this.loading = false;
        this.cd.markForCheck();
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

    if (!this.service.freelancer) {
      console.error('Service has no freelancer');
      alert('Erro: Freelancer não encontrado para este serviço.');
      return;
    }
    
    console.log('Service data:', this.service);
    console.log('Freelancer:', this.service.freelancer);
    console.log('Freelancer ID:', this.service.freelancer.id);
    
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
}
