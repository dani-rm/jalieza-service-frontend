import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonTextarea, IonButton, IonRow, IonGrid, IonCol } from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { FooterComponent } from './../../components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-crear-comunicado',
  templateUrl: './crear-comunicado.page.html',
  styleUrls: ['./crear-comunicado.page.scss'],
  standalone: true,
  imports: [IonCol, IonGrid, IonRow, IonButton, IonTextarea, IonLabel, IonItem, IonInput, IonContent, CommonModule, FormsModule, NavbarComponent, FooterComponent]
})
export class CrearComunicadoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
