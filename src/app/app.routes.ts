import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'buscar-ciudadano',
    loadComponent: () => import('./pages/buscar-ciudadano/buscar-ciudadano.page').then( m => m.BuscarCiudadanoPage)
  },
  {
    path: 'registrar-ciudadano',
    loadComponent: () => import('./pages/registrar-ciudadano/registrar-ciudadano.page').then( m => m.RegistrarCiudadanoPage)
  },

];
