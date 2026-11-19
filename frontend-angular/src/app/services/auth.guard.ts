import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = new AuthService(null as any); // Injeção manual (alternativa abaixo com inject())
  const router = new Router();

  // Verificar se o usuário está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Se a rota requer um papel específico, verificar
  const requiredRole = route.data['role'] as string;
  if (requiredRole && !authService.hasRole(requiredRole as any)) {
    router.navigate(['/']); // redireciona para home quando falta permissão
    return false;
  }

  return true;
};

// Versão alternativa (recomendada) usando inject():
import { inject } from '@angular/core';

export const authGuardV2: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredRole = route.data['role'] as string;
  if (requiredRole && !authService.hasRole(requiredRole as any)) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
