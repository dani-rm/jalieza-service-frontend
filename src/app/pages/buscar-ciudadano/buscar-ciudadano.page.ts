import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent} from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { FooterComponent } from './../../components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-buscar-ciudadano',
  templateUrl: './buscar-ciudadano.page.html',
  styleUrls: ['./buscar-ciudadano.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, NavbarComponent, FooterComponent]
})
export class BuscarCiudadanoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
