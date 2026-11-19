import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BrowseServicesComponent } from './pages/browse-services/browse-services.component';
import { CreateServiceComponent } from './pages/create-service/create-service.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MyRequestsComponent } from './pages/my-requests/my-requests.component';
import { MyJobsComponent } from './pages/my-jobs/my-jobs.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { authGuardV2 } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'browse', component: BrowseServicesComponent },
  { path: 'freelancer/:id', component: ServiceDetailComponent },
  { path: 'service/:id', component: ServiceDetailComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuardV2] },
  { 
    path: 'create-service', 
    component: CreateServiceComponent, 
    canActivate: [authGuardV2]
  },
  { 
    path: 'my-requests', 
    component: MyRequestsComponent, 
    canActivate: [authGuardV2]
  },
  { 
    path: 'my-jobs', 
    component: MyJobsComponent, 
    canActivate: [authGuardV2]
  },
  { path: 'become-freelancer', loadComponent: () => import('./pages/become-freelancer/become-freelancer.component').then(m => m.BecomeFreelancerComponent), canActivate: [authGuardV2] },
  { path: '**', redirectTo: '' }
];
