import { Routes } from '@angular/router';
import { autenticacaoGuard } from './guards/autenticacao.guard';

import { Dashboard } from './pages/dashboard/dashboard';
import { Consultas } from './pages/consultas/consultas';
import { Usuarios } from './pages/usuarios/usuarios'; 
import { Login } from './pages/login/login'; // 👈 Importe o seu componente de Login aqui

export const routes: Routes = [
  // 1. Rota pública de login (não tem canActivate para não dar loop)
  { path: 'login', component: Login },

  // 2. Rota raiz redireciona para o dashboard com segurança
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // 3. Todas as outras rotas agora ficam blindadas pelo Guard
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [autenticacaoGuard], // 👈 O Guard confere o login antes de desenhar a tela
    data: { perfis: ['ADMIN', 'RECEPCIONISTA', 'DENTISTA'] } 
  },
  { 
    path: 'consultas', 
    component: Consultas, 
    canActivate: [autenticacaoGuard],
    data: { perfis: ['ADMIN', 'RECEPCIONISTA', 'DENTISTA'] } 
  },
  { 
    path: 'usuarios', 
    component: Usuarios, 
    canActivate: [autenticacaoGuard],
    data: { perfis: ['ADMIN'] } // Apenas Admin entra
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];