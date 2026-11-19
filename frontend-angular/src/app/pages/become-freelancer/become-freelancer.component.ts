import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MockApiService } from '../../services/mock-api.service';

interface CategoryOption {
  value: string;
  label: string;
}

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
  isLoading = true;

  categoryOptions: CategoryOption[] = [
    { value: 'Technology', label: 'Tecnologia' },
    { value: 'HomeServices', label: 'Serviços Domésticos' },
    { value: 'HealthAndWellness', label: 'Saúde e Bem-estar' },
    { value: 'Education', label: 'Educação' },
    { value: 'CreativeArts', label: 'Artes Criativas' },
    { value: 'BusinessAndFinance', label: 'Negócios e Finanças' },
    { value: 'PersonalCare', label: 'Cuidados Pessoais' },
    { value: 'EventsAndEntertainment', label: 'Eventos e Entretenimento' },
    { value: 'WritingAndTranslation', label: 'Escrita e Tradução' },
    { value: 'MarketingAndSales', label: 'Marketing e Vendas' },
    { value: 'LegalAndConsulting', label: 'Jurídico e Consultoria' },
    { value: 'Other', label: 'Outro' }
  ];

  constructor(private fb: FormBuilder, private auth: AuthService, private api: MockApiService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required]
    });

    // Buscar usuário atualizado do backend
    this.auth.refreshCurrentUser().subscribe({
      next: (user) => {
        console.log('BecomeFreelancer - User refreshed:', user);
        this.initializeFreelancerCheck(user);
      },
      error: (err) => {
        console.error('Error refreshing user:', err);
        // Se falhar, usa o usuário em cache
        const user = this.auth.currentUserValue;
        if (user) {
          this.initializeFreelancerCheck(user);
        }
      }
    });
  }

  private initializeFreelancerCheck(user: any): void {
    console.log('BecomeFreelancer - User:', user);
    console.log('BecomeFreelancer - isFreelancer:', user.isFreelancer);
    
    if (user.isFreelancer) {
      console.log('User is already freelancer, setting isExistingFreelancer = true');
      this.isExistingFreelancer = true;
    }

    console.log('BecomeFreelancer - Fetching freelancer profile for userId:', user.id);
    this.api.getFreelancerByUserId(user.id).subscribe({
      next: (f: any) => {
        console.log('Freelancer profile response:', f);
        // Se for um array, pega o primeiro elemento
        let profile = Array.isArray(f) ? f[0] : f;
        // Verifica se o objeto tem realmente dados (não é vazio e tem id)
        if (profile && profile.id) {
          this.existingFreelancer = profile;
          this.isExistingFreelancer = true;
          console.log('Set isExistingFreelancer = true because profile found');
        } else {
          console.log('Profile response is empty or invalid, skipping');
        }
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching freelancer profile:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  submit(): void {
    if (!this.auth.isAuthenticated()) {
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
    const raw = this.form.value;
    const payload = {
      title: String(raw.title ?? ''),
      description: String(raw.description ?? ''),
      category: raw.category
    };

    this.api.createFreelancerForUser(user.id, payload).subscribe({
      next: (f: any) => {
        // Após criar o freelancer, buscar o usuário atualizado do backend
        this.auth.refreshCurrentUser().subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigateByUrl(`/profile`);
          },
          error: (err) => {
            // Mesmo se falhar ao buscar usuário atualizado, atualiza localmente
            const updated = { ...user, isFreelancer: true };
            this.auth.updateCurrentUser(updated);
            this.isSubmitting = false;
            this.router.navigateByUrl(`/profile`);
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = 'Erro ao submeter — tente novamente.';
        console.error('create freelancer error', err);
      }
    });
  }
}
