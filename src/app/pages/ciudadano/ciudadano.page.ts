import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel,
  IonCol, IonGrid, IonRow, IonButtons, IonIcon, IonItem, IonCard,
  IonCardContent, IonList,ToastController, IonText,AlertController
} from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { addCircleOutline, menuOutline } from 'ionicons/icons';
import { Router } from '@angular/router';


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
       private toastController: ToastController,
         private alertController: AlertController,
    public authService: AuthService,
    private ciudadanoService: CiudadanoService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
     private router: Router,
  ) {
    addIcons({ menuOutline, addCircleOutline });
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
      console.log('ID ciudadano recibido en ruta:', id);
    if (id) {
      const ciudadanoId = +id;

      this.cargarDatos(ciudadanoId);

      // Detectar si hay que refrescar (por registro nuevo de cargo)
      if (localStorage.getItem('cargoActualizado') === 'true') {
        localStorage.removeItem('cargoActualizado');
        this.cargarDatos(ciudadanoId); // recarga todo de nuevo
      }
    } else {
      console.warn('⚠️ No se proporcionó ID de ciudadano en la ruta');
    }
  }
 async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

async mostrarToastError(mensaje: string) {
  const toast = await this.toastController.create({
    message: mensaje,
    duration: 3000,
    color: 'danger',
    position: 'top'
  });
  await toast.present();
}

  cargarDatos(ciudadanoId: number) {
    // 1. Obtener ciudadano
    this.ciudadanoService.getCiudadanoPorId(ciudadanoId).subscribe({
      next: (data) => {
        this.ciudadano = data;
         console.log('🧠 Ciudadano:', this.ciudadano);
        this.cargarCargosDelCiudadano(ciudadanoId);
         // 2. Obtener cargos
      },
      error: (error) => {
        console.error('❌ Error al obtener ciudadano:', error);
      }
    });
  }

  cargarCargosDelCiudadano(id: number) {
    this.ciudadanoService.getCargosDelCiudadano(id).subscribe({
      next: (cargos) => {
        this.cargos = cargos;
      },
      error: (err) => {
        console.error('❌ Error al obtener cargos del ciudadano:', err);
      }
    });
  }

  cambiarSeccion(seccion: string) {
    this.seccionActual = seccion;
    this.mostrarMenu = false;
  }

  agregarCargo() {
    this.navCtrl.navigateForward(`/ciudadano/${this.ciudadano.id}/agregar-cargo`);
  }

  volver() {
    this.navCtrl.back();
  }

  editarDatos() {
    this.navCtrl.navigateForward(`/ciudadano/${this.ciudadano.id}/editar-datos-generales-ciudadano`);
  }

  editarCargos() {
    this.navCtrl.navigateForward(`/ciudadano/${this.ciudadano.id}/editar-cargos-ciudadano`);
  }
async eliminarCiudadano() {
  const alert = await this.alertController.create({
    header: '¿Estás seguro?',
    message: 'Esta acción eliminará al ciudadano. ¿Deseas continuar?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary'
      },
      {
        text: 'Eliminar',
        handler: async () => {
          const id = this.ciudadano.id;

          this.ciudadanoService.eliminarCiudadano(id).subscribe({
            next: async () => {
              await this.mostrarToast('Ciudadano eliminado correctamente');
           this.router.navigate(['/buscar-ciudadano']);
              this.cargarCiudadano(); // 🔁 vuelve a cargar datos actualizados
            },
            error: async (err) => {
              console.error('Error al eliminar ciudadano', err);
              await this.mostrarToastError('Ocurrió un error al eliminar al ciudadano');
            },
          });
        }
      }
    ]
  });

  await alert.present();
}

async restaurarCiudadano() {
  const alert = await this.alertController.create({
    header: 'Confirmar',
    message: '¿Estás seguro que quieres restaurar este ciudadano?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Sí, restaurar',
        handler: () => {
          this.ejecutarRestauracion();
        }
      }
    ]
  });

  await alert.present();
}

private ejecutarRestauracion() {
  const id = this.ciudadano.id;

  this.ciudadanoService.restaurarCiudadano(id).subscribe({
    next: async () => {
      await this.mostrarToast('Ciudadano restaurado correctamente');
      this.router.navigate(['/buscar-ciudadano']);
      this.cargarCiudadano(); // recarga
      console.log('Ciudadano cargado:', this.ciudadano);
    },
    error: async (err) => {
      console.error('Error al restaurar ciudadano', err);
      await this.mostrarToastError('Ocurrió un error al restaurar al ciudadano');
    },
  });
}


// Método que recarga desde el backend
cargarCiudadano() {
  this.ciudadanoService.getCiudadanoPorId(this.ciudadano.id).subscribe((data) => {
    this.ciudadano = data;
  });
}

}
