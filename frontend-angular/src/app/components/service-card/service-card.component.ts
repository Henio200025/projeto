import { Component, EventEmitter, Input, Output, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreelancerListItem } from '../../services/mock-api.service';
import { RatingService } from '../../services/rating.service';

export type ServiceCardModel = FreelancerListItem;

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent implements OnInit {
  private ratingService = inject(RatingService);

  @Input() service!: ServiceCardModel;
  @Output() open = new EventEmitter<number | string>();

  ratingCount = signal<number>(0);

  ngOnInit(): void {
    // Carregar contagem de avaliações para o card
    if (this.service?.id) {
      this.ratingService.getRatingsByFreelancer(Number(this.service.id)).subscribe({
        next: (ratings) => {
          this.ratingCount.set(ratings.length);
        },
        error: (err) => {
          console.error('Erro ao carregar contagem de avaliações:', err);
          this.ratingCount.set(0);
        }
      });
    }
  }

  onOpen() {
    this.open.emit(this.service.id);
  }
}
