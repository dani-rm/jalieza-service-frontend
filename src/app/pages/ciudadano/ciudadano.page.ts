import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel,
  IonCol, IonGrid, IonRow, IonButtons, IonIcon, IonItem, IonCard,
  IonCardContent, IonList, IonText
} from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'; // <-- Importante
import { addIcons } from 'ionicons';
import { addCircleOutline, menuOutline } from 'ionicons/icons';

@Component({
  selector: 'app-ciudadano',
  templateUrl: './ciudadano.page.html',
  styleUrls: ['./ciudadano.page.scss'],
  standalone: true,
  imports: [
    IonText, IonList, IonCardContent, IonCard, IonItem, IonIcon, IonButtons,
    IonRow, IonGrid, IonCol, IonLabel, IonButton, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule, NavbarComponent, FooterComponent
  ]
})
export class CiudadanoPage implements OnInit {
  ciudadano: any = null;
  cargos: any[] = [];
  mostrarMenu = false;
  seccionActual = 'Datos Generales';

  constructor(
    private ciudadanoService: CiudadanoService,
    private navCtrl: NavController,
    private route: ActivatedRoute // <-- Nuevo
  ) {
    addIcons({ menuOutline, addCircleOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.ciudadanoService.getCiudadanoPorId(+id).subscribe({
        next: (data) => {
          this.ciudadano = data;
          this.cargos = data.services || [];
        },
        error: (error) => {
          console.error('Error al obtener ciudadano:', error);
        }
      });
    } else {
      console.warn('No se proporcionó ID de ciudadano en la ruta');
    }
  }

  cambiarSeccion(seccion: string) {
    this.seccionActual = seccion;
    this.mostrarMenu = false;
  }

  agregarCargo() {
    this.navCtrl.navigateForward('/agregar-cargo');
  }

  volver() {
    this.navCtrl.back();
  }

  editarDatos() {
    this.navCtrl.navigateForward('/editar-datos-generales-ciudadano');
  }

  editarCargos() {
    this.navCtrl.navigateForward('/editar-cargos-ciudadano');
  }
}
