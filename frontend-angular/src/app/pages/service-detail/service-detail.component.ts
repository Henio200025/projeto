import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockApiService } from '../../services/mock-api.service';
import { AuthService } from '../../services/auth.service';
import { RequestModalComponent } from '../../components/request-modal/request-modal.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, RouterModule, FormsModule, ServiceCardComponent, RequestModalComponent],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  id: string | null = null;
  service: any = null;
  loading = false;

  // rating form
  ratingScore = 5;
  ratingComment = '';
  submittingRating = false;
  modalOpen = false;

  constructor(private route: ActivatedRoute, private api: MockApiService, private router: Router, private auth: AuthService, private cd: ChangeDetectorRef) {}

  goToRelated(id: any) {
    // if event carries id, navigate
    this.router.navigateByUrl(`/service/${id}`);
  }

  ngOnInit(): void {
    // Listen for route id changes and fetch when available
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');
      if (id !== this.id) {
        this.id = id;
        this.fetch();
      }
    });
  }

  fetch() {
    if (!this.id) return;
    this.loading = true;
    this.api.getServiceById(this.id).subscribe((s) => {
      console.debug('[ServiceDetail] fetched service', s, 'for id', this.id);
      this.service = s;
      this.loading = false;
      // application uses zoneless change detection; ensure UI updates
      try { this.cd.markForCheck(); } catch (e) { /* graceful */ }
    }, (err) => {
      console.error('[ServiceDetail] error fetching service', err);
      this.loading = false;
      try { this.cd.markForCheck(); } catch (e) {}
    });
  }

  submitRating() {
    if (!this.id || !this.ratingScore) return;
    if (!this.auth.isAuthenticated()) {
      this.router.navigateByUrl(`/login?returnUrl=/service/${this.id}`);
      return;
    }
    this.submittingRating = true;
    const user = this.auth.currentUserValue || { id: 'anonymous', name: 'Usuário' };
    this.api.postRating(this.id, { score: this.ratingScore, comment: this.ratingComment, user: { id: user.id, name: (user as any).nickname || (user as any).email || (user as any).name || 'Usuário' } }).subscribe((r) => {
      // refresh
      this.ratingScore = 5;
      this.ratingComment = '';
      this.submittingRating = false;
      this.fetch();
    });
  }

  openRequest() {
    if (!this.auth.isAuthenticated()) {
      // redirect to login with returnUrl
      this.router.navigateByUrl(`/login?returnUrl=/service/${this.id}`);
      return;
    }
    this.modalOpen = true;
  }

  onRequestClosed() {
    this.modalOpen = false;
  }

  onRequestSubmitted(res: any) {
    // optionally show a toast; reload requests later
    this.modalOpen = false;
  }
}