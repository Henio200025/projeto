import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MockApiService } from '../../services/mock-api.service';
import { ChangeDetectorRef } from '@angular/core';
import { CategoryLabelPipe } from '../../pipes/category-label.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CategoryLabelPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  freelancer: any = null;
  freelancerLoading = false;
  services: any[] = [];
  servicesLoading = false;
  // create service UI
  showCreateServiceForm = false;
  createServiceForm!: FormGroup;
  createServiceSubmitting = false;
  // freelancer edit
  editingFreelancer = false;
  freelancerEditForm!: FormGroup;
  freelancerEditSubmitting = false;
  isEditing = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private api: MockApiService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Inicializar formulário DEPOIS de ter o currentUser
    this.initializeForm();
    
    console.log('Profile loaded with user:', this.currentUser);

    // Subscrever para mudanças no usuário atual
    this.authService.currentUser$.subscribe(user => {
      if (user && user !== this.currentUser) {
        console.log('User data updated, reloading form');
        this.currentUser = user;
        this.reloadFormData();
      }
    });

    // if the logged-in user is a freelancer, fetch their freelancer profile
    if (String(this.currentUser.role || '').toLowerCase() === 'freelancer') {
      this.freelancerLoading = true;
      this.api.getFreelancerByUserId(this.currentUser.id).subscribe((f) => {
        this.freelancer = f;
        this.freelancerLoading = false;
        this.cd.markForCheck();
        // after we know freelancer identity, try load services owned by this user
        this.fetchServicesForFreelancer();
      });
    }
  }

  /**
   * Recarrega os dados do formulário com os valores atuais do usuário
   */
  private reloadFormData(): void {
    if (this.profileForm && this.currentUser) {
      this.profileForm.patchValue({
        nickname: this.currentUser.nickname || '',
        phone: this.currentUser.phone || '',
        name: this.currentUser.name || '',
        bio: this.currentUser.bio || ''
      });
      this.cd.markForCheck();
    }
  }

  private fetchServicesForFreelancer(): void {
    this.servicesLoading = true;
    const fid = this.freelancer?.id || this.currentUser?.id;
    if (fid) {
      this.api.getServicesByFreelancerId(fid).subscribe((list: any) => {
        this.services = list || [];
        this.servicesLoading = false;
        try { this.cd.markForCheck(); } catch (e) {}
      });
    } else {
      // fallback: search all
      this.api.searchServices('', undefined, 1, 50).subscribe(({ data }: any) => {
        const uid = this.currentUser?.id;
        this.services = (data || []).filter((s: any) => {
          const fid = s?.freelancer?.id;
          return fid === uid || (this.freelancer && fid === this.freelancer.userId) || (this.freelancer && fid === this.freelancer.id);
        });
        this.servicesLoading = false;
        try { this.cd.markForCheck(); } catch (e) {}
      });
    }
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      nickname: [this.currentUser?.nickname || '', [Validators.minLength(3)]],
      phone: [this.currentUser?.phone || ''],
      name: [this.currentUser?.name || '', [Validators.minLength(3)]],
      bio: [this.currentUser?.bio || '', [Validators.maxLength(500)]]
    });
  }

  // create service form
  private initCreateServiceForm(): void {
    this.createServiceForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.min(0)]],
      deliveryTime: [''],
      category: ['']
    });
  }

  private initFreelancerEditForm(): void {
    this.freelancerEditForm = this.fb.group({
      title: [this.freelancer?.title || '', [Validators.required, Validators.minLength(3)]],
      bio: [this.freelancer?.bio || '', [Validators.required, Validators.minLength(10)]],
      skills: [((this.freelancer?.skills || [])).join(', ') || '', Validators.required],
      hourlyRate: [this.freelancer?.hourlyRate || null, [Validators.min(0)]],
      categories: [((this.freelancer?.categories || [])).join(', ') || ''],
      portfolioUrl: [this.freelancer?.portfolioUrl || ''],
      location: [this.freelancer?.location || '']
    });
  }

  toggleEditFreelancer(): void {
    this.editingFreelancer = !this.editingFreelancer;
    if (this.editingFreelancer) {
      this.initFreelancerEditForm();
    }
  }

  saveFreelancerEdit(): void {
    console.log('saveFreelancerEdit called');
    console.log('Form valid:', this.freelancerEditForm?.valid);
    console.log('Form value:', this.freelancerEditForm?.value);
    
    if (!this.freelancerEditForm) {
      console.error('Form not initialized');
      return;
    }
    
    if (this.freelancerEditForm.invalid) {
      console.error('Form invalid');
      // Marcar todos os campos como touched para exibir erros
      Object.keys(this.freelancerEditForm.controls).forEach(key => {
        this.freelancerEditForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    if (!this.freelancer) {
      console.error('No freelancer data');
      return;
    }

    this.freelancerEditSubmitting = true;
    const raw = this.freelancerEditForm.value;
    const payload = {
      title: String(raw.title ?? ''),
      bio: String(raw.bio ?? ''),
      skills: (String(raw.skills ?? '')).split(',').map((s: string) => s.trim()).filter(Boolean),
      hourlyRate: raw.hourlyRate == null || raw.hourlyRate === '' ? undefined : Number(raw.hourlyRate),
      categories: (String(raw.categories ?? '')).split(',').map((s: string) => s.trim()).filter(Boolean),
      portfolioUrl: String(raw.portfolioUrl ?? ''),
      location: String(raw.location ?? '')
    };

    console.log('Sending payload:', payload);

    this.api.updateFreelancer(this.freelancer.id, payload).subscribe({
      next: (updated: any) => {
        console.log('Update successful:', updated);
        if (updated) {
          this.freelancer = updated;
        }
        this.freelancerEditSubmitting = false;
        this.editingFreelancer = false;
        try { this.cd.markForCheck(); } catch (e) {}
      },
      error: (err) => {
        console.error('Update error:', err);
        this.freelancerEditSubmitting = false;
      }
    });
  }

  toggleCreateService(): void {
    this.showCreateServiceForm = !this.showCreateServiceForm;
    if (this.showCreateServiceForm && !this.createServiceForm) {
      this.initCreateServiceForm();
    }
  }

  createService(): void {
    if (!this.createServiceForm || this.createServiceForm.invalid) return;
    if (!this.freelancer && !this.currentUser) return;

    this.createServiceSubmitting = true;
    const raw = this.createServiceForm.value;
    const payload = {
      title: String(raw.title ?? ''),
      description: String(raw.description ?? ''),
      price: raw.price == null || raw.price === '' ? undefined : Number(raw.price),
      deliveryTime: String(raw.deliveryTime ?? ''),
      category: String(raw.category ?? '')
    };

    const fid = this.freelancer?.id || this.currentUser!.id;
    this.api.createServiceForFreelancer(fid, payload).subscribe({
      next: (svc: any) => {
        this.services.unshift(svc);
        this.createServiceSubmitting = false;
        this.showCreateServiceForm = false;
        try { this.cd.markForCheck(); } catch (e) {}
      },
      error: (err) => {
        console.error('create service error', err);
        this.createServiceSubmitting = false;
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    console.log('saveProfile called');
    console.log('Form valid:', this.profileForm.valid);
    console.log('Form value:', this.profileForm.value);
    
    if (this.profileForm.invalid) {
      console.error('Form invalid');
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSaving = true;
    const formData = this.profileForm.value;

    // Atualizar o usuário com TODOS os dados do formulário
    if (this.currentUser) {
      const updatedUser = { 
        ...this.currentUser, 
        nickname: formData.nickname || this.currentUser.nickname,
        name: formData.name || this.currentUser.name,
        phone: formData.phone,
        bio: formData.bio
      };
      
      console.log('Updating user:', updatedUser);
      this.authService.updateCurrentUser(updatedUser);
      this.currentUser = updatedUser;
    }

    this.isSaving = false;
    this.isEditing = false;
    
    // Forçar detecção de mudanças
    this.cd.markForCheck();
    console.log('Profile saved successfully');
  }

  /**
   * Formata o telefone automaticamente no padrão (DD) DDDDD-DDDD
   */
  formatPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    // Limita a 11 dígitos (DDD + número)
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Aplica a máscara
    if (value.length > 0) {
      if (value.length <= 2) {
        value = `(${value}`;
      } else if (value.length <= 7) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      } else {
        value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
      }
    }
    
    // Atualiza o valor no input e no form control
    input.value = value;
    this.profileForm.patchValue({ phone: value }, { emitEvent: false });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
