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
import { addCircleOutline, menuOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { FinalizacionServicio } from 'src/app/interfaces/servicios.interface';


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
    addIcons({ menuOutline, addCircleOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
console.log(this.ciudadano);

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
    // 1. Obtener ciudadano (que ya incluye los servicios)
    this.ciudadanoService.getCiudadanoPorId(ciudadanoId).subscribe({
      next: (data) => {
        this.ciudadano = data;
        console.log('🧠 Ciudadano:', this.ciudadano);
        
        // 2. Usar los servicios que vienen en el objeto del ciudadano
        if (this.ciudadano.services) {
          this.cargos = this.ciudadano.services.sort((a: any, b: any) =>
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
          );
          console.log('📋 Servicios del ciudadano:', this.cargos);
        } else {
          this.cargos = [];
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener ciudadano:', error);
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
      this.cargarCiudadano();
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
    // Actualizar también los servicios
    if (this.ciudadano.services) {
      this.cargos = this.ciudadano.services.sort((a: any, b: any) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      );
    } else {
      this.cargos = [];
    }
  });
}

// ✅ NUEVO: Finalizar servicio
async finalizarServicio(servicioId: number) {
  const alert = await this.alertController.create({
    header: 'Finalizar Servicio',
    message: '¿Está seguro que desea finalizar este servicio?',
    inputs: [
      {
        name: 'end_date',
        type: 'date',
        label: 'Fecha de finalización',
        value: new Date().toISOString().split('T')[0]
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Finalizar',
        handler: (data) => {
          if (data.end_date) {
            this.procesarFinalizacion(servicioId, data.end_date);
          } else {
            this.mostrarToastError('Debe seleccionar una fecha de finalización');
          }
        }
      }
    ]
  });

  await alert.present();
}

// ✅ NUEVO: Procesar finalización del servicio
procesarFinalizacion(servicioId: number, endDate: string) {
  const datos: FinalizacionServicio = {
    service_status: 'completado',
    end_date: endDate
  };

  this.ciudadanoService.finalizarServicio(servicioId, datos).subscribe({
    next: async () => {
      console.log('✅ Servicio finalizado correctamente');
      await this.mostrarToast('Servicio finalizado correctamente');
      this.cargarDatos(this.ciudadano.id); // Recargar la lista de cargos
    },
    error: async (err) => {
      console.error('❌ Error al finalizar servicio:', err);
      await this.mostrarToastError('Error al finalizar servicio');
    }
  });
}

}
