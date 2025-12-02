import { TestBed } from '@angular/core/testing';
import { RequestModalComponent } from './request-modal.component';
import { MockApiService } from '../../services/mock-api.service';

describe('RequestModalComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestModalComponent]
    }).compileComponents();
  });

  it('submits a request using mock API', (done) => {
    const fixture = TestBed.createComponent(RequestModalComponent);
    const comp = fixture.componentInstance;
    const svc = TestBed.inject(MockApiService);

    comp.open = true;
    comp.serviceId = 's1';
    comp.serviceTitle = 'Teste';
    comp.message = 'Preciso do serviço';

    fixture.detectChanges();

    comp.submit();

    setTimeout(() => {
      expect(comp.submitting).toBeFalse();
      done();
    }, 200);
  });
});
