import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonCol, IonGrid, IonRow, IonButtons, IonIcon, IonItem, IonCard, IonCardContent, IonList, IonText } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline, menuOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ciudadano',
  templateUrl: './ciudadano.page.html',
  styleUrls: ['./ciudadano.page.scss'],
  standalone: true,
  imports: [IonText, IonList, IonCardContent, IonCard, IonItem, IonIcon, IonButtons,  IonRow, IonGrid, IonCol, IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent,
    FooterComponent
  ]
})
export class CiudadanoPage implements OnInit {
  constructor(private usuarioService: UsuarioService, private navCtrl: NavController) {
    addIcons({menuOutline, addCircleOutline});
  }

  usuario: any = {}; // Variable para almacenar los datos del usuario
  cargos: any[] = []; // Variable para almacenar los cargos del usuario
  mostrarMenu = false;
  seccionActual = 'Datos Generales';

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    this.cargos = this.usuario?.cargos || []; // si no tiene, se asigna arreglo vacío
  }

  cambiarSeccion(seccion: string) {
    this.seccionActual = seccion;
    this.mostrarMenu = false;
  }

  agregarCargo() {
    this.navCtrl.navigateForward('/agregar-cargo');
  }

  volver() {
    this.navCtrl.back(); // Vuelve a la lista anterior
  }

  editarDatos() {
    this.navCtrl.navigateForward('/editar-datos-generales-ciudadano');
  }

  editarCargos() {
    this.navCtrl.navigateForward('/editar-cargos-ciudadano');
  }

}
