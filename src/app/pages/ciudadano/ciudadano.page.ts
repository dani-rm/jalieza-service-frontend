import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonCol, IonGrid, IonRow,
  } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ciudadano',
  templateUrl: './ciudadano.page.html',
  styleUrls: ['./ciudadano.page.scss'],
  standalone: true,
  imports: [ IonRow, IonGrid, IonCol, IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent,
    FooterComponent
  ]
})
export class CiudadanoPage implements OnInit {
  constructor(private usuarioService: UsuarioService, private navCtrl: NavController) {}
  usuario: any; // Variable para almacenar los datos del usuario

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
  }

  volver() {
    this.navCtrl.back(); // Vuelve a la lista anterior
  }

  editarDatos() {
    this.navCtrl.navigateForward('/editar-datos-generales-ciudadano');
  }

}
