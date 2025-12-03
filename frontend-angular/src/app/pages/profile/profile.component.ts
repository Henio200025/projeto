import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { MockApiService } from '../../services/mock-api.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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

    this.initializeForm();

    // if the logged-in user is a freelancer, fetch their freelancer profile
    if (this.currentUser.role === 'freelancer') {
      this.freelancerLoading = true;
      this.api.getFreelancerByUserId(this.currentUser.id).subscribe((f) => {
        this.freelancer = f;
        this.freelancerLoading = false;
        try { this.cd.markForCheck(); } catch (e) {}
        // after we know freelancer identity, try load services owned by this user
        this.fetchServicesForFreelancer();
      });
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
      nickname: ['', [Validators.minLength(3)]],
      phone: ['', [Validators.pattern(/^\d{0,11}$/)]],
      name: ['', [Validators.minLength(3)]],
      bio: ['', [Validators.maxLength(500)]]
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
    if (!this.freelancerEditForm || this.freelancerEditForm.invalid) return;
    if (!this.freelancer) return;

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

    this.api.updateFreelancer(this.freelancer.id, payload).subscribe((updated: any) => {
      if (updated) {
        this.freelancer = updated;
      }
      this.freelancerEditSubmitting = false;
      this.editingFreelancer = false;
      try { this.cd.markForCheck(); } catch (e) {}
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
    if (this.profileForm.invalid) {
      return;
    }

    this.isSaving = true;
    const formData = this.profileForm.value;

    // Simular salvamento (em produção, seria uma requisição HTTP)
    setTimeout(() => {
      // Atualizar o usuário com o novo apelido
      if (this.currentUser) {
        const updatedUser = { ...this.currentUser, nickname: formData.nickname };
        this.authService.updateCurrentUser(updatedUser);
        this.currentUser = updatedUser;
      }

      this.isSaving = false;
      this.isEditing = false;
    }, 500);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
