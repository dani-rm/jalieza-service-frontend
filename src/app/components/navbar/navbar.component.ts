import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonTitle,IonMenuButton, IonToolbar, IonButtons, IonImg,  } from "@ionic/angular/standalone";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [   IonImg, IonButtons, IonToolbar,IonMenuButton,IonTitle, IonHeader,CommonModule],
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
  constructor(public router: Router) {
  }
  // Oculta el menú en rutas específicas
  debeOcultarMenu(): boolean {
    const rutasSinMenu = ['/registrar-ciudadano', '/editar-datos-generales-ciudadano',
      '/editar-cargos-ciudadano', '/agregar-cargo'];
    return rutasSinMenu.includes(this.router.url);
  }



}
