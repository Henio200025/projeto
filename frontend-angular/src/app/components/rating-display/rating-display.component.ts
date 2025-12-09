import { Component, Input, OnInit, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../services/rating.service';
import { RatingResponseDTO } from '../../models/rating.model';

@Component({
  selector: 'app-rating-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-display.component.html',
  styleUrls: ['./rating-display.component.css']
})
export class RatingDisplayComponent implements OnInit {
  private ratingService = inject(RatingService);

  @Input() freelancerId!: number;
  @Output() ratingsLoaded = new EventEmitter<number>();

  ratings = signal<RatingResponseDTO[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  averageRating = signal<number>(0);

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.loading.set(true);
    this.error.set(null);

    this.ratingService.getRatingsByFreelancer(this.freelancerId).subscribe({
      next: (data) => {
        this.ratings.set(data);
        
        // Calcular média
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.score, 0) / data.length;
          this.averageRating.set(Math.round(avg * 10) / 10);
        }
        
        // Emitir contagem de avaliações
        this.ratingsLoaded.emit(data.length);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar avaliações:', err);
        this.error.set('Erro ao carregar avaliações');
        this.ratingsLoaded.emit(0);
        this.loading.set(false);
      }
    });
  }

  /**
   * Renderizar estrelas baseado na pontuação
   */
  getStars(score: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  isStarFilled(starNumber: number, score: number): boolean {
    return starNumber <= Math.round(score);
  }

  /**
   * Formatar data
   */
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
