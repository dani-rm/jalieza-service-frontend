import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonTitle,IonMenuButton,IonRouterLink, IonItem,IonMenu, IonList, IonContent, IonToolbar, IonButtons, IonImg, IonItemDivider, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [IonLabel,   IonImg, IonButtons, IonToolbar, IonContent,IonMenuButton,IonMenu, IonList, IonItem, IonTitle, IonHeader,CommonModule],
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {
  @Input({required: true}) title!: string;
  constructor(public router: Router) {}

  // Método para verificar si está en la página de "Registrar Ciudadano"
  isRegistrarCiudadano(): boolean {
    return this.router.url === '/registrar-ciudadano';
  }

  logoFunction(){
      window.location.href = "/home";
  }
  ngOnInit() {}

}
