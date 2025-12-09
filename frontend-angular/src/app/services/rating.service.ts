import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RatingRequestDTO, RatingResponseDTO } from '../models/rating.model';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private readonly API_BASE = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Criar avaliação para um serviço concluído
   */
  createRating(serviceId: number, ratingData: RatingRequestDTO): Observable<RatingResponseDTO> {
    return this.http.post<RatingResponseDTO>(
      `${this.API_BASE}/service/${serviceId}/rating`,
      ratingData
    );
  }

  /**
   * Atualizar avaliação existente
   */
  updateRating(serviceId: number, ratingId: number, ratingData: RatingRequestDTO): Observable<RatingResponseDTO> {
    return this.http.patch<RatingResponseDTO>(
      `${this.API_BASE}/service/${serviceId}/rating/${ratingId}`,
      ratingData
    );
  }

  /**
   * Deletar avaliação
   */
  deleteRating(serviceId: number, ratingId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.API_BASE}/service/${serviceId}/rating/${ratingId}`
    );
  }

  /**
   * Obter todas as avaliações de um freelancer
   */
  getRatingsByFreelancer(freelancerId: number): Observable<RatingResponseDTO[]> {
    return this.http.get<RatingResponseDTO[]>(
      `${this.API_BASE}/freelancer/${freelancerId}/ratings`
    );
  }

  /**
   * Obter todas as avaliações do usuário logado
   */
  getMyRatings(userId: number): Observable<RatingResponseDTO[]> {
    return this.http.get<RatingResponseDTO[]>(
      `${this.API_BASE}/users/${userId}/ratings`
    );
  }
}
