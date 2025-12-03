import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryLabelPipe } from '../../pipes/category-label.pipe';

export interface CategoryCardModel {
  id: number | string;
  name: string;
  icon?: string;
  count?: number;
}

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CategoryLabelPipe],
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.css']
})
export class CategoryCardComponent {
  @Input() category!: CategoryCardModel;
  @Input() active = false;
  @Output() select = new EventEmitter<CategoryCardModel>();

  onSelect() {
    this.select.emit(this.category);
  }
}
