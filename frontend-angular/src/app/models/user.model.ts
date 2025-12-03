// User models - alinhado com backend Java

export interface UserSimpleResponseDTO {
  id: number;
  name: string;
}

export interface AddressDTO {
  id?: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PhoneDTO {
  id?: number;
  number: string;
  isWhatsApp: boolean;
  description: string;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  password: string;
  isFreelancer: boolean;
  addressDTO: AddressDTO[];
  phoneDTO: PhoneDTO[];
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;        // JWT token
  expiresIn: number;    // Long (milliseconds)
}

export interface UserModel {
  id: number;
  email: string;
  role: string;  // 'USER' ou 'FREELANCER'
}

// Para compatibilidade com código existente
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
  isFreelancer: boolean;
  nickname?: string;
  phone?: string;
  bio?: string;
  addresses?: AddressDTO[];
  phones?: PhoneDTO[];
}
