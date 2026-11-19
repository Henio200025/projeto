import { CategoryType } from './enums';
import { UserSimpleResponseDTO } from './user.model';

// Freelancer models - alinhado com backend Java

export interface CategorySimpleResponseDTO {
  id: number;
  name: CategoryType;
}

export interface FreelancerRequestDTO {
  title: string;          // min=5, max=100
  description: string;    // min=20
  category: CategoryType; // ENUM
}

export interface FreelancerResponseDTO {
  id: number;
  title: string;
  description: string;
  user: UserSimpleResponseDTO;
  category: CategorySimpleResponseDTO;
  averageRating: number;
}

export interface FreelancerSimpleResponseDTO {
  id: number;
  title: string;
  user: UserSimpleResponseDTO;
}

// Para compatibilidade com código existente
export interface Freelancer {
  id: number;
  userId: number;
  userName: string;
  title: string;
  description: string;
  category: string;
  averageRating: number;
  profileImage?: string;
  skills?: string[];
  completedJobs?: number;
  memberSince?: string;
}

// Para compatibilidade com código existente
export interface FreelancerProfile {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  averageRating: number;
  skills?: string[];
  hourlyRate?: number;
  availability?: string;
  user?: UserSimpleResponseDTO;
}
