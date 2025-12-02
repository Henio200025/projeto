import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockApiService } from '../../services/mock-api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-request-modal',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.css']
})
export class RequestModalComponent {
  @Input() open = false;
  @Input() serviceId: string | number | null = null;
  @Input() serviceTitle = '';
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();

  step = 1;
  message = '';
  submitting = false;

  constructor(private api: MockApiService, private auth: AuthService) {}

  close() {
    this.open = false;
    this.step = 1;
    this.message = '';
    this.closed.emit();
  }

  next() {
    if (this.step < 3) this.step += 1;
  }

  prev() {
    if (this.step > 1) this.step -= 1;
  }

  submit() {
    if (!this.serviceId) return;
    const user = this.auth.currentUserValue ?? { id: 'anonymous', name: 'Anônimo' } as any;
    this.submitting = true;
    this.api.postRequest(this.serviceId, { user: { id: user.id, name: user.nickname || user.email || user.name || 'Usuário' }, message: this.message }).subscribe({
      next: (res: any) => {
        this.submitting = false;
        this.submitted.emit(res);
        this.step = 3;
      },
      error: (err: any) => {
        // reset submitting if something fails
        this.submitting = false;
        console.error('Erro enviando pedido:', err);
      }
    });
  }
}
