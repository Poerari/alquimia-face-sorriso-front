import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const autenticacaoGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Executa a validação real apenas do lado do cliente (Navegador)
  if (isPlatformBrowser(platformId)) {
    const usuarioSalvo = localStorage.getItem('usuario');

    // 🚨 SE NÃO ESTIVER LOGADO: Barra a visualização do Dashboard e manda pro Login
    if (!usuarioSalvo) {
      router.navigate(['/login']);
      return false;
    }

    const usuario = JSON.parse(usuarioSalvo);
    const perfil = usuario.perfil;
    const perfisPermitidos = route.data['perfis'] as Array<string>;

    // SE ESTIVER LOGADO, MAS TENTAR ENTRAR ONDE NÃO DEVE (Ex: Dr. João em Usuários)
    if (perfisPermitidos && !perfisPermitidos.includes(perfil)) {
      alert('Acesso negado! Seu perfil não tem permissão para acessar esta página.');
      router.navigate(['/dashboard']); 
      return false;
    }
  }

  return true; // Permite o acesso se estiver tudo correto
};