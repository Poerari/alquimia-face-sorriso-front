import { Routes } from '@angular/router';
import { autenticacaoGuard } from './guards/autenticacao.guard';

// Páginas
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Consultas } from './pages/consultas/consultas';
import { Pacientes } from './pages/pacientes/pacientes';
import { Dentistas } from './pages/dentistas/dentistas';
import { Especialidades } from './pages/especialidades/especialidades';
import { Relatorios } from './pages/relatorios/relatorios';
import { Usuarios } from './pages/usuarios/usuarios';

export const routes: Routes = [

  // Login
  {
    path: 'login',
    component: Login
  },

  // Rota inicial
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Dashboard
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [autenticacaoGuard],
    data: { perfis: ['ADMIN', 'RECEPCIONISTA', 'DENTISTA'] }
  },

  // Consultas
  {
    path: 'consultas',
    component: Consultas,
    canActivate: [autenticacaoGuard],
    data: { perfis: ['ADMIN', 'RECEPCIONISTA', 'DENTISTA'] }
  },

  // Pacientes
  {
    path: 'pacientes',
    component: Pacientes,
    canActivate: [autenticacaoGuard],
    data: { perfis: ['ADMIN', 'RECEPCIONISTA', 'DENTISTA'] }
  },

  // Dentistas
  {
    path: 'dentistas',
    component: Dentistas,
    canActivate: [autenticacaoGuard],
    data: { perfis: ['ADMIN', 'RECEPCIONISTA', 'DENTISTA'] }
  },

  // Especialidades
  {
    path: 'especialidades',
    component: Especialidades,
    canActivate: [autenticacaoGuard],
    data: { perfis: ['ADMIN', 'RECEPCIONISTA', 'DENTISTA'] }
  },

    {
    path: 'relatorios',
    component: Relatorios,
    canActivate: [autenticacaoGuard],
    data: { perfis: ['ADMIN', 'RECEPCIONISTA', 'DENTISTA'] }
  },

  // Usuários (somente ADMIN)
  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [autenticacaoGuard],
    data: { perfis: ['ADMIN'] }
  },

  // Qualquer rota inválida
  {
    path: '**',
    redirectTo: 'login'
  }

];