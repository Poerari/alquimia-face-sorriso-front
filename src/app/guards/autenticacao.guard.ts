import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const autenticacaoGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const usuarioSalvo = localStorage.getItem('usuario');

    if (!usuarioSalvo) {
      router.navigate(['/login']);
      return false;
    }

   let usuario;

    try {
      usuario = JSON.parse(usuarioSalvo);
    } catch {
      localStorage.removeItem('usuario');
      router.navigate(['/login']);
      return false;
    }
    const perfil = usuario.perfil;
    const perfisPermitidos = route.data['perfis'] as Array<string>;

  
    if (perfisPermitidos && !perfisPermitidos.includes(perfil)) {
      alert('Acesso negado! Seu perfil não tem permissão para acessar esta página.');
      router.navigate(['/dashboard']); 
      return false;
    }
  }

  return true; 
};