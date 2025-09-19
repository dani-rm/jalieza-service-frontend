import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
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
    loadComponent: () => import('./pages/buscar-ciudadano/buscar-ciudadano.page').then( m => m.BuscarCiudadanoPage),
    canActivate: [AuthGuard,RoleGuard],
    data:{roles:['3','4', '1']}
  },
  {
    path: 'registrar-ciudadano',
    loadComponent: () => import('./pages/registrar-ciudadano/registrar-ciudadano.page').then( m => m.RegistrarCiudadanoPage),
    canActivate: [AuthGuard,RoleGuard],
     data: {
    roles: ['3', '1'] // solo estos roles entran
  }
  },
  {
    path: 'ciudadano/:id',
    loadComponent: () => import('./pages/ciudadano/ciudadano.page').then( m => m.CiudadanoPage),
    canActivate: [AuthGuard],
    data:{
      roles:['3','4', '1']
    }
  },
  {
    path: 'ciudadano/:id/editar-datos-generales-ciudadano',
    loadComponent: () => import('./pages/editar-datos-generales-ciudadano/editar-datos-generales-ciudadano.page').then( m => m.EditarDatosGeneralesCiudadanoPage),
        canActivate: [AuthGuard,RoleGuard],
      data: {
    roles: ['3', '1'] // solo estos roles entran
 }
  },
  {
    path: 'ciudadano/:id/editar-cargos-ciudadano',
    loadComponent: () => import('./pages/editar-cargos-ciudadano/editar-cargos-ciudadano.page').then( m => m.EditarCargosCiudadanoPage),
        canActivate: [AuthGuard,RoleGuard],
      data: {
    roles: ['3', '1'] // solo estos roles entran
  }
  },
  {
    path: 'ciudadano/:id/agregar-cargo',
    loadComponent: () => import('./pages/agregar-cargo/agregar-cargo.page').then( m => m.AgregarCargoPage),
        canActivate: [AuthGuard,RoleGuard],
      data: {
    roles: ['3', '1'] // solo estos roles entran
  }
  },
  // ✅ Rutas del módulo de Catálogo de Servicios
  {
    path: 'catalogo-servicios',
    loadComponent: () => import('./pages/catalogo-servicios/catalogo-servicios.page').then(m => m.CatalogoServiciosPage),
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['3', '1'] // Solo administradores y super administradores
    }
  },
  {
    path: 'catalogo-servicios/crear',
    loadComponent: () => import('./pages/crear-editar-servicio/crear-editar-servicio.page').then(m => m.CrearEditarServicioPage),
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['3', '1'] // Solo administradores y super administradores
    }
  },
  {
    path: 'catalogo-servicios/editar/:id',
    loadComponent: () => import('./pages/crear-editar-servicio/crear-editar-servicio.page').then(m => m.CrearEditarServicioPage),
    canActivate: [AuthGuard, RoleGuard],
    data: {
      roles: ['3', '1'] // Solo administradores y super administradores
    }
  },

];
