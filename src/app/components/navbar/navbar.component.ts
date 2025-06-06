import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonTitle,IonMenuButton, IonItem,IonMenu, IonList, IonContent, IonToolbar, IonButtons, IonImg } from "@ionic/angular/standalone";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [IonImg, IonButtons, IonToolbar, IonContent,IonMenuButton,IonMenu, IonList, IonItem, IonTitle, IonHeader,CommonModule],
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {
@Input({required: true}) title!: string;
  constructor() { }

  ngOnInit() {}

}
