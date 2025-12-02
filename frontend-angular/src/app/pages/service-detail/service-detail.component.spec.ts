import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ServiceDetailComponent } from './service-detail.component';
import { MockApiService } from '../../services/mock-api.service';

describe('ServiceDetailComponent', () => {
  beforeEach(async () => {
    const fakeAuth = { isAuthenticated: () => false, currentUserValue: null };
    const fakeRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') };

    await TestBed.configureTestingModule({
      imports: [ServiceDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: 's1' }) } },
        { provide: Router, useValue: fakeRouter },
        { provide: (await import('../../services/auth.service')).AuthService, useValue: fakeAuth }
      ]
    }).compileComponents();
  });

  it('loads the service from mock API', (done) => {
    const fixture = TestBed.createComponent(ServiceDetailComponent);
    const comp = fixture.componentInstance;
    const svc = TestBed.inject(MockApiService);

    fixture.detectChanges();

    // Wait a bit for the async mock
    setTimeout(() => {
      expect(comp.service).toBeTruthy();
      expect(comp.service.id).toBe('s1');
      done();
    }, 250);
  });

  it('redirects to login when trying to open request modal while unauthenticated', () => {
    const fixture = TestBed.createComponent(ServiceDetailComponent);
    const comp = fixture.componentInstance;
    const router = TestBed.inject(Router) as any;
    spyOn(router, 'navigateByUrl');

    // Ensure user not authenticated
    const auth = TestBed.inject(MockApiService); // using MockApiService as placeholder here for setup
    // Call openRequest
    comp.openRequest();

    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('redirects to login when trying to submit rating while unauthenticated', () => {
    const fixture = TestBed.createComponent(ServiceDetailComponent);
    const comp = fixture.componentInstance;
    const router = TestBed.inject(Router) as any;
    spyOn(router, 'navigateByUrl');

    comp.id = 's1';
    comp.ratingScore = 5;
    comp.ratingComment = 'Ótimo';

    comp.submitRating();

    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('submits rating when authenticated', (done) => {
    // create component with authenticated auth service
    const auth = { isAuthenticated: () => true, currentUserValue: { id: 'u_client', email: 'a@b.com', nickname: 'Cliente' } } as any;
    const fakeRouter = { navigateByUrl: jasmine.createSpy('navigateByUrl') };

    TestBed.overrideProvider((await import('@angular/router')).Router, { useValue: fakeRouter });
    TestBed.overrideProvider((await import('../../services/auth.service')).AuthService, { useValue: auth });

    const fixture = TestBed.createComponent(ServiceDetailComponent);
    const comp = fixture.componentInstance;

    comp.id = 's1';
    comp.ratingScore = 4;
    comp.ratingComment = 'Bom trabalho';

    fixture.detectChanges();

    comp.submitRating();

    // wait for mock api
    setTimeout(() => {
      expect(comp.submittingRating).toBeFalse();
      done();
    }, 300);
  });
});
