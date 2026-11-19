import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AddressDTO, PhoneDTO } from '../../models/user.model';

// Validador customizado para comparar senhas
function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  public returnUrl: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // capture returnUrl if present
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    // Redirecionar se já estiver logado
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl || '/');
      return;
    }

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      // Endereço opcional
      street: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: [''],
      // Telefone opcional
      phoneNumber: [''],
      phoneDescription: [''],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: passwordMatchValidator });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.error = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    const {
      name,
      email,
      password,
      street,
      city,
      state,
      zipCode,
      country,
      phoneNumber,
      phoneDescription
    } = this.registerForm.value;

    // Endereço opcional: se algum campo for preenchido, todos tornam-se obrigatórios
    const hasAddressInput = [street, city, state, zipCode, country].some((v: string) => !!v?.trim());
    if (hasAddressInput) {
      const missingAddress = [street, city, state, zipCode, country].some((v: string) => !v?.trim());
      if (missingAddress) {
        this.isLoading = false;
        this.error = 'Preencha todos os campos de endereço ou deixe-os em branco.';
        return;
      }
    }

    const addressDTO: AddressDTO[] = hasAddressInput ? [{
      id: 0,
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: country.trim()
    }] : [];

    // Telefone opcional: se número informado, inclui
    const hasPhone = !!phoneNumber?.trim();
    const phoneDTO: PhoneDTO[] = hasPhone ? [{
      id: 0,
      number: phoneNumber.trim(),
      isWhatsApp: false,
      description: phoneDescription?.trim() || ''
    }] : [];

    this.authService.register(name, email, password, addressDTO, phoneDTO).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Cadastro bem-sucedido:', response);
        this.success = 'Conta criada — redirecionando...';
        const target = this.returnUrl || '/';
        this.router.navigateByUrl(target);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao cadastrar:', err);
        this.error = err.error?.detail || 'Erro ao criar conta. Tente novamente.';
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      const labels: { [key: string]: string } = {
        email: 'E-mail',
        name: 'Nome',
        password: 'Senha',
        confirmPassword: 'Confirmação de Senha',
        street: 'Rua',
        city: 'Cidade',
        state: 'Estado',
        zipCode: 'CEP',
        country: 'País',
        phoneNumber: 'Telefone'
      };
      return `${labels[fieldName] || fieldName} é obrigatório.`;
    }
    if (field.errors['email']) {
      return 'E-mail inválido.';
    }
    if (field.errors['minlength']) {
      return `Senha deve ter no mínimo ${field.errors['minlength'].requiredLength} caracteres.`;
    }
    if (this.registerForm.errors && this.registerForm.errors['passwordMismatch'] && fieldName === 'confirmPassword') {
      return 'As senhas não correspondem.';
    }

    return 'Campo inválido.';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
