import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
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

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user']
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.error = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login bem-sucedido:', response);
        // Redirecionar para dashboard ou home
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao fazer login:', err);
        this.error = err.error?.detail || 'E-mail ou senha inválidos. Tente novamente.';
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return `${fieldName === 'email' ? 'E-mail' : 'Senha'} é obrigatório.`;
    }
    if (field.errors['email']) {
      return 'E-mail inválido.';
    }
    if (field.errors['minlength']) {
      return `Senha deve ter no mínimo ${field.errors['minlength'].requiredLength} caracteres.`;
    }

    return 'Campo inválido.';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
