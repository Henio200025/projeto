import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User, AddressDTO, PhoneDTO } from '../../models/user.model';
import { MockApiService } from '../../services/mock-api.service';
import { ContactInfoService } from '../../services/contact-info.service';
import { ChangeDetectorRef } from '@angular/core';
import { FreelancerResponseDTO } from '../../models/freelancer.model';
import { CategoryType } from '../../models/enums';

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
  freelancer: FreelancerResponseDTO | null = null;
  freelancerLoading = false;
  // freelancer edit
  editingFreelancer = false;
  freelancerEditForm!: FormGroup;
  freelancerEditSubmitting = false;
  isEditing = false;
  isSaving = false;

  // Contact Info Management
  addresses: AddressDTO[] = [];
  phones: PhoneDTO[] = [];
  loadingAddresses = false;
  loadingPhones = false;
  showAddressForm = false;
  showPhoneForm = false;
  addressForm!: FormGroup;
  phoneForm!: FormGroup;
  editingAddressId: number | null = null;
  editingPhoneId: number | null = null;
  savingContactInfo = false;

  categoryOptions = [
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private api: MockApiService,
    private contactInfoService: ContactInfoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Buscar dados atualizados do usuário do backend
    this.authService.refreshCurrentUser().subscribe({
      next: (updatedUser) => {
        console.log('User refreshed from backend:', updatedUser);
        this.currentUser = updatedUser;
        this.initializeForm();
        
        // Load addresses and phones AFTER user is set
        if (this.currentUser?.id) {
          this.loadAddresses();
          this.loadPhones();
        }

        // if the logged-in user is a freelancer, fetch their freelancer profile
        console.log('Current user:', this.currentUser);
        console.log('Is freelancer?', this.currentUser.isFreelancer);
        
        if (this.currentUser.isFreelancer) {
          this.freelancerLoading = true;
          this.api.getFreelancerByUserId(this.currentUser.id).subscribe({
            next: (f) => {
              console.log('Freelancer data received:', f);
              // Se for um array, pega o primeiro elemento
              let profile = Array.isArray(f) ? f[0] : f;
              this.freelancer = profile || null;
              this.freelancerLoading = false;
              this.cd.detectChanges();
            },
            error: (err) => {
              console.error('Error loading freelancer profile:', err);
              this.freelancerLoading = false;
              this.cd.detectChanges();
            }
          });
        }
      },
      error: (err) => {
        console.error('Error refreshing user:', err);
        // Se falhar, usa o usuário em cache
        this.currentUser = this.authService.currentUserValue;
        
        if (!this.currentUser) {
          this.router.navigate(['/login']);
          return;
        }

        this.initializeForm();
        
        if (this.currentUser?.id) {
          this.loadAddresses();
          this.loadPhones();
        }

        if (this.currentUser?.isFreelancer) {
          this.freelancerLoading = true;
          this.api.getFreelancerByUserId(this.currentUser.id).subscribe({
            next: (f) => {
              let profile = Array.isArray(f) ? f[0] : f;
              this.freelancer = profile || null;
              this.freelancerLoading = false;
              this.cd.detectChanges();
            },
            error: (err) => {
              console.error('Error loading freelancer profile:', err);
              this.freelancerLoading = false;
              this.cd.detectChanges();
            }
          });
        }
      }
    });

    // Subscrever para mudanças no usuário atual
    this.authService.currentUser$.subscribe(user => {
      if (user && user !== this.currentUser) {
        console.log('User data updated, reloading form');
        this.currentUser = user;
        this.reloadFormData();
      }
    });
  }

  getCategoryLabel(categoryValue: string | CategoryType): string {
    const found = this.categoryOptions.find(c => c.value === categoryValue);
    return found ? found.label : String(categoryValue);
  }

  /**
   * Recarrega os dados do formulário com os valores atuais do usuário
   */
  private reloadFormData(): void {
    if (this.profileForm && this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name || ''
      });
      this.cd.detectChanges();
    }
  }

  // ============ ADDRESS & PHONE MANAGEMENT ============

  loadAddresses(): void {
    if (!this.currentUser?.id) {
      console.warn('No user ID available for loading addresses');
      return;
    }
    this.loadingAddresses = true;
    console.log('Loading addresses for user:', this.currentUser.id);
    this.contactInfoService.getAddressesByUserId(this.currentUser.id).subscribe({
      next: (addresses) => {
        console.log('Addresses loaded:', addresses);
        this.addresses = addresses || [];
        this.loadingAddresses = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar endereços:', err);
        this.addresses = [];
        this.loadingAddresses = false;
        this.cd.detectChanges();
      }
    });
  }

  loadPhones(): void {
    if (!this.currentUser?.id) {
      console.warn('No user ID available for loading phones');
      return;
    }
    this.loadingPhones = true;
    console.log('Loading phones for user:', this.currentUser.id);
    this.contactInfoService.getPhonesByUserId(this.currentUser.id).subscribe({
      next: (phones) => {
        console.log('Phones loaded:', phones);
        this.phones = phones || [];
        this.loadingPhones = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar telefones:', err);
        this.phones = [];
        this.loadingPhones = false;
        this.cd.detectChanges();
      }
    });
  }

  toggleAddressForm(): void {
    if (!this.isEditing) {
      this.isEditing = true;
    }
    this.showAddressForm = !this.showAddressForm;
    if (this.showAddressForm) {
      this.initAddressForm();
    }
  }

  togglePhoneForm(): void {
    if (!this.isEditing) {
      this.isEditing = true;
    }
    this.showPhoneForm = !this.showPhoneForm;
    if (this.showPhoneForm) {
      this.initPhoneForm();
    }
  }

  private initAddressForm(): void {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  private initPhoneForm(): void {
    this.phoneForm = this.fb.group({
      number: ['', Validators.required],
      description: [''],
      isWhatsApp: [false]
    });
  }

  saveAddress(): void {
    if (!this.addressForm.valid || !this.currentUser?.id) return;

    this.savingContactInfo = true;
    const addressDTO: AddressDTO = this.addressForm.value;

    if (this.editingAddressId) {
      this.contactInfoService.updateAddress(this.editingAddressId, addressDTO).subscribe({
        next: (updated) => {
          const idx = this.addresses.findIndex(a => a.id === this.editingAddressId);
          if (idx >= 0) {
            this.addresses[idx] = updated;
          }
          this.resetAddressForm();
          this.savingContactInfo = false;
          this.authService.refreshCurrentUser().subscribe();
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao atualizar endereço:', err);
          this.savingContactInfo = false;
        }
      });
    } else {
      this.contactInfoService.addAddress(this.currentUser.id, addressDTO).subscribe({
        next: (created) => {
          this.addresses.unshift(created);
          this.resetAddressForm();
          this.savingContactInfo = false;
          this.authService.refreshCurrentUser().subscribe();
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao criar endereço:', err);
          this.savingContactInfo = false;
        }
      });
    }
  }

  savePhone(): void {
    if (!this.phoneForm.valid || !this.currentUser?.id) return;

    this.savingContactInfo = true;
    const phoneDTO: PhoneDTO = this.phoneForm.value;

    if (this.editingPhoneId) {
      this.contactInfoService.updatePhone(this.editingPhoneId, phoneDTO).subscribe({
        next: (updated) => {
          const idx = this.phones.findIndex(p => p.id === this.editingPhoneId);
          if (idx >= 0) {
            this.phones[idx] = updated;
          }
          this.resetPhoneForm();
          this.savingContactInfo = false;
          // Atualizar usuário no AuthService
          this.authService.refreshCurrentUser().subscribe();
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao atualizar telefone:', err);
          this.savingContactInfo = false;
        }
      });
    } else {
      this.contactInfoService.addPhone(this.currentUser.id, phoneDTO).subscribe({
        next: (created) => {
          this.phones.unshift(created);
          this.resetPhoneForm();
          this.savingContactInfo = false;
          // Atualizar usuário no AuthService para que o novo telefone apareça em outras telas
          this.authService.refreshCurrentUser().subscribe();
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao criar telefone:', err);
          this.savingContactInfo = false;
        }
      });
    }
  }

  editAddress(address: AddressDTO): void {
    this.editingAddressId = address.id || null;
    this.addressForm = this.fb.group({
      street: [address.street, Validators.required],
      city: [address.city, Validators.required],
      state: [address.state, Validators.required],
      zipCode: [address.zipCode, Validators.required],
      country: [address.country, Validators.required]
    });
    this.showAddressForm = true;
  }

  editPhone(phone: PhoneDTO): void {
    this.editingPhoneId = phone.id || null;
    this.phoneForm = this.fb.group({
      number: [phone.number, Validators.required],
      description: [phone.description || ''],
      isWhatsApp: [phone.isWhatsApp || false]
    });
    this.showPhoneForm = true;
  }

  deleteAddress(addressId: number | undefined): void {
    if (!addressId || !confirm('Tem certeza que deseja deletar este endereço?')) return;

    this.contactInfoService.deleteAddress(addressId).subscribe({
      next: () => {
        this.addresses = this.addresses.filter(a => a.id !== addressId);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao deletar endereço:', err);
      }
    });
  }

  deletePhone(phoneId: number | undefined): void {
    if (!phoneId || !confirm('Tem certeza que deseja deletar este telefone?')) return;

    this.contactInfoService.deletePhone(phoneId).subscribe({
      next: () => {
        this.phones = this.phones.filter(p => p.id !== phoneId);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao deletar telefone:', err);
      }
    });
  }

  private resetAddressForm(): void {
    this.showAddressForm = false;
    this.editingAddressId = null;
    if (this.addressForm) {
      this.addressForm.reset();
    }
  }

  private resetPhoneForm(): void {
    this.showPhoneForm = false;
    this.editingPhoneId = null;
    if (this.phoneForm) {
      this.phoneForm.reset();
    }
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: [this.currentUser?.name || '', [Validators.minLength(3)]]
    });
  }

  private initFreelancerEditForm(): void {
    this.freelancerEditForm = this.fb.group({
      title: [this.freelancer?.title || '', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [this.freelancer?.description || '', [Validators.required, Validators.minLength(20)]],
      category: [this.freelancer?.category?.name || '', Validators.required]
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
      description: String(raw.description ?? ''),
      category: raw.category
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


  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.resetAddressForm();
      this.resetPhoneForm();
      this.showAddressForm = false;
      this.showPhoneForm = false;
    }
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

    if (this.currentUser) {
      const updatedUser = { 
        ...this.currentUser, 
        name: formData.name || this.currentUser.name
      };
      
      console.log('Updating user:', updatedUser);
      this.authService.updateCurrentUser(updatedUser);
      this.currentUser = updatedUser;
    }

    this.isSaving = false;
    this.isEditing = false;
    this.resetAddressForm();
    this.resetPhoneForm();
    this.cd.detectChanges();
    console.log('Profile saved successfully');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
