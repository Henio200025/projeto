import { TestBed } from '@angular/core/testing';
import { ServiceCardComponent } from './service-card.component';

describe('ServiceCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCardComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ServiceCardComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('should emit open event when clicked', () => {
    const fixture = TestBed.createComponent(ServiceCardComponent);
    const comp = fixture.componentInstance;
    comp.service = { id: 's1', title: 'Test', price: 42 } as any;

    spyOn(comp.open, 'emit');

    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const root = el.querySelector('div');
    (root as HTMLElement).click();

    expect(comp.open.emit).toHaveBeenCalledWith('s1');
  });
});
