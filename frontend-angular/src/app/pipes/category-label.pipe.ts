import { Pipe, PipeTransform } from '@angular/core';
import { CategoryType, CategoryTypeLabels } from '../models/enums';

@Pipe({
  name: 'categoryLabel',
  standalone: true
})
export class CategoryLabelPipe implements PipeTransform {
  transform(value: string | CategoryType | undefined): string {
    // Se for undefined ou vazio, retornar string vazia
    if (!value) {
      return '';
    }
    
    // Se for string, tentar converter para CategoryType
    const categoryKey = value as CategoryType;
    
    // Retornar tradução se existir, senão retorna o valor original
    return CategoryTypeLabels[categoryKey] || value;
  }
}
