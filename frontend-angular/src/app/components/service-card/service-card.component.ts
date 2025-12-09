import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreelancerListItem } from '../../services/mock-api.service';

export type ServiceCardModel = FreelancerListItem;

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule],
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
