import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const usuarioSalvo = localStorage.getItem('usuario');

  // 1. Se não houver usuário logado, barra na hora e vai pro login
  if (!usuarioSalvo) {
    router.navigate(['/login']);
    return false;
  }

  // Converter a string do localStorage de volta para objeto
  const usuario = JSON.parse(usuarioSalvo);

  // 2. Verificar se a rota exige um perfil específico (data.perfisPermitidos)
  const perfisPermitidos = route.data?.['perfisPermitidos'] as Array<string>;

  if (perfisPermitidos && !perfisPermitidos.includes(usuario.perfil)) {
    // Se o usuário não tiver o perfil necessário, redireciona para o Dashboard ou exibe alerta
    alert('Você não tem permissão para acessar esta página.');
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};