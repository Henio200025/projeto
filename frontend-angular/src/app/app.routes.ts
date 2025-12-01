import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BrowseServicesComponent } from './pages/browse-services/browse-services.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { FreelancerProfileComponent } from './pages/freelancer-profile/freelancer-profile.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { CreateServiceComponent } from './pages/create-service/create-service.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuardV2 } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'browse', component: BrowseServicesComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuardV2] },
  { path: 'service/:id', component: ServiceDetailComponent },
  { path: 'freelancer/:id', component: FreelancerProfileComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuardV2]
  },
  { 
    path: 'messages', 
    component: MessagesComponent, 
    canActivate: [authGuardV2]
  },
  { 
    path: 'create-service', 
    component: CreateServiceComponent, 
    canActivate: [authGuardV2]
  },
  { path: '**', redirectTo: '' } // Wildcard route for 404
];
