import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirecionar se já estiver logado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', Validators.required],
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

    const { email, password, role } = this.registerForm.value;

    this.authService.register(email, password, role).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Cadastro bem-sucedido:', response);
        // Redirecionar para dashboard
        this.router.navigate(['/dashboard']);
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
        password: 'Senha',
        confirmPassword: 'Confirmação de Senha'
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
