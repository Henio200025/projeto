import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressDTO, PhoneDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ContactInfoService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Address endpoints
  addAddress(userId: number, addressDTO: AddressDTO): Observable<AddressDTO> {
    return this.http.post<AddressDTO>(`${this.apiUrl}/adress/${userId}/add`, addressDTO);
  }

  updateAddress(addressId: number, addressDTO: AddressDTO): Observable<AddressDTO> {
    return this.http.put<AddressDTO>(`${this.apiUrl}/adress/${addressId}`, addressDTO);
  }

  deleteAddress(addressId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/adress/${addressId}`);
  }

  getAddressesByUserId(userId: number): Observable<AddressDTO[]> {
    return this.http.get<AddressDTO[]>(`${this.apiUrl}/adress/${userId}/listAll`);
  }

  // Phone endpoints
  addPhone(userId: number, phoneDTO: PhoneDTO): Observable<PhoneDTO> {
    return this.http.post<PhoneDTO>(`${this.apiUrl}/phone/${userId}/add`, phoneDTO);
  }

  updatePhone(phoneId: number, phoneDTO: PhoneDTO): Observable<PhoneDTO> {
    return this.http.put<PhoneDTO>(`${this.apiUrl}/phone/${phoneId}`, phoneDTO);
  }

  deletePhone(phoneId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/phone/${phoneId}`);
  }

  getPhonesByUserId(userId: number): Observable<PhoneDTO[]> {
    return this.http.get<PhoneDTO[]>(`${this.apiUrl}/phone/${userId}/listAll`);
  }
}
