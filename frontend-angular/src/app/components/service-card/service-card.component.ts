import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ServiceCardModel {
  id: number | string;
  title: string;
  description?: string;
  price?: number;
  category?: string;
  freelancer?: { name?: string; rating?: number; reviews?: number };
}

@Component({
  selector: 'app-service-card',
  standalone: true,
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent {
  @Input() service!: ServiceCardModel;
  @Output() open = new EventEmitter<number | string>();

  onOpen() {
    this.open.emit(this.service.id);
  }
}
