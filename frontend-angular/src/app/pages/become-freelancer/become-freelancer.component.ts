import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MockApiService } from '../../services/mock-api.service';

@Component({
  selector: 'app-become-freelancer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './become-freelancer.component.html'
})
export class BecomeFreelancerComponent implements OnInit {
  form!: FormGroup;

  isSubmitting = false;
  error: string | null = null;
  formSubmitted = false;
  isExistingFreelancer = false;
  existingFreelancer: any = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private api: MockApiService, private router: Router) {}

  ngOnInit(): void {
    // initialize form after FormBuilder is available (avoid using fb in property initializer)
    this.form = this.fb.group({
      title: ['', Validators.required],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      skills: ['', Validators.required],
      hourlyRate: [null, Validators.min(0)],
      categories: [''],
      portfolioUrl: [''],
      location: ['']
    });
    // load any existing freelancer profile for current user
    const user = this.auth.currentUserValue;
    if (!user) return; // guarded route should catch

    // If user's role already marks them as freelancer, show the message (even if profile record not yet exists)
    if (String(user.role || '').toLowerCase() === 'freelancer') {
      this.isExistingFreelancer = true;
    }

    this.api.getFreelancerByUserId(user.id).subscribe((f: any) => {
      if (f) {
        // populate existing freelancer data and treat as existing freelancer in UI
        this.existingFreelancer = f;
        // If there is any freelancer record for this user, show the "already freelancer" message instead of the form
        this.isExistingFreelancer = true;
        return;
      }

      // nothing else to do when no existing freelancer record is found
    });
  }

  submit(): void {
    if (!this.auth.isAuthenticated()) {
      // redirect to login (shouldn't happen if route guard used)
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/become-freelancer' } });
      return;
    }

    this.formSubmitted = true;
    if (this.form.invalid) {
      this.error = 'Preencha corretamente todos os campos obrigatórios.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const user = this.auth.currentUserValue!;
    // sanitize values so they match the MockApi expected types (avoid passing nulls)
    const raw = this.form.value;
    const payload = {
      title: String(raw.title ?? ''),
      bio: String(raw.bio ?? ''),
      skills: (String(raw.skills ?? '')).split(',').map((s: string) => s.trim()).filter(Boolean),
      hourlyRate: raw.hourlyRate == null || raw.hourlyRate === '' ? undefined : Number(raw.hourlyRate),
      categories: (String(raw.categories ?? '')).split(',').map((s: string) => s.trim()).filter(Boolean),
      portfolioUrl: String(raw.portfolioUrl ?? ''),
      location: String(raw.location ?? '')
    };

    this.api.createFreelancerForUser(user.id, payload).subscribe({
      next: (f: any) => {
        // update local user to mark role = freelancer
        const updated = { ...user, role: 'freelancer' as const } as any;
        this.auth.updateCurrentUser(updated);
        this.isSubmitting = false;
        // go to unified profile page (own profile will show freelancer content)
        this.router.navigateByUrl(`/profile`);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = 'Erro ao submeter — tente novamente.';
        console.error('create freelancer error', err);
      }
    });
  }
}
