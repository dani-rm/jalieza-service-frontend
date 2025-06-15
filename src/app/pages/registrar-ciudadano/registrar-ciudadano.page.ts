import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonButton, IonFooter, IonItem, IonInput, IonSelect, IonSelectOption, IonList, IonHeader, IonTitle, IonToolbar, IonRow, IonCol, IonGrid, IonButtons, IonDatetime, IonTextarea } from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { FooterComponent } from './../../components/footer/footer.component';

@Component({
  selector: 'app-registrar-ciudadano',
  templateUrl: './registrar-ciudadano.page.html',
  styleUrls: ['./registrar-ciudadano.page.scss'],
  standalone: true,
  imports: [IonTextarea, IonDatetime, IonButtons, IonGrid, IonCol, IonRow, IonToolbar, IonTitle, IonHeader, IonList, IonInput, IonItem, IonFooter, IonButton, IonLabel, IonContent, CommonModule,
    FormsModule, NavbarComponent, FooterComponent, IonSelect, IonSelectOption]
})
export class RegistrarCiudadanoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
