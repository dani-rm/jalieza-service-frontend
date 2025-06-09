import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { FooterComponent } from './../../components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registrar-ciudadano',
  templateUrl: './registrar-ciudadano.page.html',
  styleUrls: ['./registrar-ciudadano.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, NavbarComponent, FooterComponent]
})
export class RegistrarCiudadanoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
