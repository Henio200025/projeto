import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../services/rating.service';
import { RatingRequestDTO } from '../../models/rating.model';

@Component({
  selector: 'app-rating-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.css']
})
export class RatingModalComponent {
  private ratingService = inject(RatingService);

  @Input() serviceId!: number;
  @Input() freelancerName: string = '';
  @Input() serviceName: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() ratingSubmitted = new EventEmitter<void>();

  score = signal<number>(0);
  comment = signal<string>('');
  isLoading = signal(false);
  error = signal<string | null>(null);

  /**
   * Definir a pontuação clicando na estrela
   */
  setScore(value: number): void {
    this.score.set(value);
  }

  /**
   * Hover para preview das estrelas
   */
  getStarClass(index: number): string {
    return index < this.score() ? 'star-filled' : 'star-empty';
  }

  /**
   * Enviar avaliação
   */
  submitRating(): void {
    if (this.score() === 0) {
      this.error.set('Por favor, selecione uma pontuação');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const ratingData: RatingRequestDTO = {
      score: this.score(),
      comment: this.comment() || undefined
    };

    this.ratingService.createRating(this.serviceId, ratingData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.ratingSubmitted.emit();
        this.close();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro ao enviar avaliação:', err);
        this.error.set(err.error?.detail || 'Erro ao enviar avaliação. Tente novamente.');
      }
    });
  }

  /**
   * Fechar modal
   */
  close(): void {
    this.closeModal.emit();
  }
}
