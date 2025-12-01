import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  isEditing = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.initializeForm();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      nickname: ['', [Validators.minLength(3)]],
      phone: ['', [Validators.pattern(/^\d{0,11}$/)]],
      name: ['', [Validators.minLength(3)]],
      bio: ['', [Validators.maxLength(500)]]
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
