import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonHeader, IonTitle,IonMenuButton,IonRouterLink, IonItem,IonMenu, IonList, IonContent, IonToolbar, IonButtons, IonImg,} from "@ionic/angular/standalone";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [  IonImg, IonButtons, IonToolbar,RouterLink,IonRouterLink, RouterLinkActive, IonContent,IonMenuButton,IonMenu, IonList, IonItem, IonTitle, IonHeader,CommonModule],
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {
@Input({required: true}) title!: string;

  logoFunction(){
      window.location.href = "/home";
  }
  constructor() { }

  ngOnInit() {}

}
