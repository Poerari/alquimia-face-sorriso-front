import { Routes } from '@angular/router';

import { Consultas } from './pages/consultas/consultas';
import { Pacientes } from './pages/pacientes/pacientes';
import { Dentistas } from './pages/dentistas/dentistas';
import { Dashboard } from './pages/dashboard/dashboard';
import { Especialidades } from './pages/especialidades/especialidades';
import { Relatorios } from './pages/relatorios/relatorios';
import { Usuarios } from './pages/usuarios/usuarios';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: 'consultas', component: Consultas },
  { path: 'pacientes', component: Pacientes },
  { path: 'dentistas', component: Dentistas },
  { path: 'dashboard', component: Dashboard },
  { path: 'especialidades', component: Especialidades },
  { path: 'relatorios', component: Relatorios },
  { path: 'usuarios', component: Usuarios },
  { path: 'login', component: Login },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];