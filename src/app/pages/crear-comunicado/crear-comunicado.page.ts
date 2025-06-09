import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { FooterComponent } from './../../components/footer/footer.component';

@Component({
  selector: 'app-crear-comunicado',
  templateUrl: './crear-comunicado.page.html',
  styleUrls: ['./crear-comunicado.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, NavbarComponent, FooterComponent]
})
export class CrearComunicadoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
