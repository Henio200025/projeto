// Rating models - alinhado com backend Java

export interface RatingRequestDTO {
  score: number;      // 1-5
  comment?: string;   // Opcional
}

export interface RatingResponseDTO {
  id: number;
  score: number;
  comment: string | null;
  servicesDTO: {
    id: number;
    description: string;
  };
  createdAt: string;
}

export interface RatingWithFreelancer extends RatingResponseDTO {
  freelancerName?: string;
  freelancerAvatar?: string;
}
