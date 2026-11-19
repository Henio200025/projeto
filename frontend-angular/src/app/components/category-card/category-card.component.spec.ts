import { TestBed } from '@angular/core/testing';
import { CategoryCardComponent } from './category-card.component';

describe('CategoryCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCardComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CategoryCardComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('should emit select on click', () => {
    const fixture = TestBed.createComponent(CategoryCardComponent);
    const comp = fixture.componentInstance;
    comp.category = { id: 1, name: 'Test', count: 10 } as any;

    spyOn(comp.select, 'emit');

    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button') as HTMLElement).click();

    expect(comp.select.emit).toHaveBeenCalledWith(comp.category);
  });
});
