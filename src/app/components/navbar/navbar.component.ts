import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonTitle, IonMenuButton, IonToolbar, IonButtons, IonImg, IonButton } from "@ionic/angular/standalone";
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [IonButton, IonImg, IonButtons, IonToolbar, IonMenuButton, IonTitle, IonHeader, CommonModule, RouterLink],
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {
  isMobile = false;

  ngOnInit() {
    const matcher = window.matchMedia('(max-width: 767px)');
    this.isMobile = matcher.matches;

    matcher.addEventListener('change', (event) => {
      this.isMobile = event.matches;
    });
  }

  @Input({required: true}) title!: string;
  constructor(public router: Router, public authService: AuthService) {
  }
  
  // Oculta el menú en rutas específicas
  debeOcultarMenu(): boolean {
    const rutasSinMenu = ['/editar-datos-generales-ciudadano',
      '/editar-cargos-ciudadano', '/agregar-cargo', '/home'];
    return rutasSinMenu.includes(this.router.url);
  }

  // Oculta el navbar completo en la ruta de login
  esRutaLogin(): boolean {
    return this.router.url === '/home';
  }

  // Cerrar sesión
  cerrarSesion() {
    this.authService.logout();
  }



}
