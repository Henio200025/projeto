import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatusCheck {
  id: string;
  client_name: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class StatusService {
  private base = '/api/status';
  constructor(private http: HttpClient) {}

  getAll(): Observable<StatusCheck[]> {
    return this.http.get<StatusCheck[]>(this.base);
  }

  create(clientName: string) {
    return this.http.post<StatusCheck>(this.base, { client_name: clientName });
  }
}
