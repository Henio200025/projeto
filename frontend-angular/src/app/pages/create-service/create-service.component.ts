import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MockApiService } from '../../services/mock-api.service';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-service.component.html'
})
export class CreateServiceComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  isFreelancer = false;
  freelancer: any = null;
  freelancerLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private api: MockApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.auth.currentUserValue;
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (!currentUser.isFreelancer) {
      this.router.navigate(['/become-freelancer']);
      return;
    }

    this.isFreelancer = true;

    // Buscar perfil de freelancer
    this.freelancerLoading = true;
    this.api.getFreelancerByUserId(currentUser.id).subscribe({
      next: (f: any) => {
        let profile = Array.isArray(f) ? f[0] : f;
        this.freelancer = profile;
        this.freelancerLoading = false;

        // Inicializar formulário após carregar freelancer
        this.initializeForm();
      },
      error: (err: any) => {
        console.error('Error loading freelancer profile:', err);
        this.freelancerLoading = false;
        this.error = 'Erro ao carregar perfil de freelancer';
      }
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(20)]],
      price: ['', [Validators.required, Validators.min(0)]],
      location: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  submit(): void {
    if (!this.form.valid || !this.freelancer) {
      this.error = 'Preencha corretamente todos os campos obrigatórios.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.form.value;
    const payload = {
      description: formValue.description,
      price: parseFloat(formValue.price),
      location: formValue.location,
      createdAt: new Date().toISOString(),
      userId: this.auth.currentUserValue?.id
    };

    this.api.createService(this.freelancer.id, payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.router.navigate(['/profile']);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.error = 'Erro ao criar serviço — tente novamente.';
        console.error('Error creating service:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}