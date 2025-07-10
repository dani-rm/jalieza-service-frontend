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
  {
    path: 'ciudadano',
    loadComponent: () => import('./pages/ciudadano/ciudadano.page').then( m => m.CiudadanoPage)
  },
  {
    path: 'editar-datos-generales-ciudadano',
    loadComponent: () => import('./pages/editar-datos-generales-ciudadano/editar-datos-generales-ciudadano.page').then( m => m.EditarDatosGeneralesCiudadanoPage)
  },
  {
    path: 'editar-cargos-ciudadano',
    loadComponent: () => import('./pages/editar-cargos-ciudadano/editar-cargos-ciudadano.page').then( m => m.EditarCargosCiudadanoPage)
  },
  {
    path: 'agregar-cargo',
    loadComponent: () => import('./pages/agregar-cargo/agregar-cargo.page').then( m => m.AgregarCargoPage)
  },

];
