import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel,
  IonCol, IonGrid, IonRow, IonButtons, IonIcon, IonItem,
  IonList, ToastController, IonText, AlertController, IonSelect, IonSelectOption,
  ModalController, IonInput, IonTextarea
} from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { addCircleOutline, menuOutline, checkmarkCircleOutline, cloudDownloadOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { FinalizacionServicio } from 'src/app/interfaces/servicios.interface';
import { ModalFinalizarServicioComponent } from 'src/app/components/modal-finalizar-servicio/modal-finalizar-servicio.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-ciudadano',
  templateUrl: './ciudadano.page.html',
  styleUrls: ['./ciudadano.page.scss'],
  standalone: true,
  imports: [
    IonText, IonList, IonItem, IonIcon, IonButtons,
    IonRow, IonGrid, IonCol, IonLabel, IonButton, IonContent, IonHeader,
    IonTitle, IonToolbar, IonSelect, IonSelectOption,
    CommonModule, FormsModule, NavbarComponent
  ]
})
export class CiudadanoPage implements OnInit {
  ciudadano: any = null;
  cargos: any[] = [];
  mostrarMenu = false;
  seccionActual = 'Datos Generales';

  // ✅ Variables para órdenes desbloqueadas
  ordenesDesbloqueadas: any[] = [];
  maxOrdenDesbloqueada: number = 0;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    public authService: AuthService,
    private ciudadanoService: CiudadanoService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
  ) {
    addIcons({ menuOutline, addCircleOutline, checkmarkCircleOutline, cloudDownloadOutline });
  }

  ngOnInit() {
    console.log(this.ciudadano);

    // Escuchar cambios en los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ID ciudadano recibido en ruta:', id);

      if (id) {
        const ciudadanoId = +id;
        this.cargarDatos(ciudadanoId);

        // Detectar si hay que refrescar (por registro nuevo de cargo)
        if (localStorage.getItem('cargoActualizado') === 'true') {
          localStorage.removeItem('cargoActualizado');
        }
      } else {
        console.warn('⚠️ No se proporcionó ID de ciudadano en la ruta');
      }
    });
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

    // 3. Cargar órdenes desbloqueadas
    this.cargarOrdenesDesbloqueadas(ciudadanoId);
  }

  // ✅ Cargar órdenes desbloqueadas del ciudadano
  cargarOrdenesDesbloqueadas(ciudadanoId: number) {
    this.ciudadanoService.getOrdenesDisponibles(ciudadanoId).subscribe({
      next: (response: any) => {
        this.maxOrdenDesbloqueada = response.max_orden_desbloqueada;
        this.ordenesDesbloqueadas = response.ordenes_disponibles;
        console.log('🔓 Órdenes desbloqueadas:', this.ordenesDesbloqueadas);
        console.log('📊 Máxima orden desbloqueada:', this.maxOrdenDesbloqueada);
      },
      error: (err) => {
        console.error('❌ Error al cargar órdenes desbloqueadas:', err);
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
    this.cambiarSeccion('Datos Generales');
  }

  volverCiudadanos() {
    this.router.navigate(['/buscar-ciudadano']);
  }

  editarDatos() {
    this.navCtrl.navigateForward(`/ciudadano/${this.ciudadano.id}/editar-datos-generales-ciudadano`);
  }

  editarCargos() {
    this.navCtrl.navigateForward(`/ciudadano/${this.ciudadano.id}/editar-cargos-ciudadano`);
  }
  // Mapear estado civil a texto visible
  mostrarEstadoCivil(ciudadano: any): string {
    const valor = ciudadano?.marital_status;
    if (valor === 1 || valor === '1') return 'Soltero';
    if (valor === 2 || valor === '2') return 'Casado';
    if (typeof valor === 'string') {
      const v = valor.toLowerCase();
      if (v.includes('solter')) return 'Soltero';
      if (v.includes('casad')) return 'Casado';
    }
    return valor || '-';
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

  // ✅ Cambiar estado del servicio con confirmación (solicitar observaciones al finalizar)
  async cambiarEstadoServicio(cargo: any, event: any) {
    const nuevoEstado = event.detail.value;
    const estadoAnterior = cargo.service_status;

    // Si se va a finalizar (completado o inconcluso), abrir modal personalizado
    if (nuevoEstado === 'completado' || nuevoEstado === 'inconcluso') {
      const fechaPorDefecto = cargo.end_date || new Date().toISOString().split('T')[0];

      const modal = await this.modalController.create({
        component: ModalFinalizarServicioComponent,
        componentProps: {
          nuevoEstado: nuevoEstado,
          fechaActual: fechaPorDefecto,
          observacionesActuales: cargo.observations || ''
        }
      });

      await modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === 'confirm' && data) {
        // Solo actualizar el estado si se confirma
        this.actualizarEstadoServicio(cargo, nuevoEstado, data.end_date, data.observations);
      }
      // Si se cancela, no hacer nada - el select mantendrá el valor original

      return; // no continuar con confirmación genérica
    }

    // Confirmación genérica para otros estados
    let mensaje = `¿Confirma cambiar el estado a "${nuevoEstado}"?`;

    const alert = await this.alertController.create({
      header: 'Confirmar cambio',
      message: mensaje,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            cargo.service_status = estadoAnterior;
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.actualizarEstadoServicio(cargo, nuevoEstado);
          }
        }
      ]
    });

    await alert.present();
  }

  // Actualizar estado en el backend (acepta fecha y observaciones opcionales)
  actualizarEstadoServicio(cargo: any, nuevoEstado: string, endDate?: string, observations?: string) {
    const datos: any = {
      service_status: nuevoEstado
    };

    // Fecha de finalización
    if (endDate) {
      datos.end_date = endDate;
    } else if (nuevoEstado === 'completado' && !cargo.end_date) {
      datos.end_date = new Date().toISOString().split('T')[0];
    }

    // Observaciones
    if (typeof observations === 'string') {
      datos.observations = observations;
    }

    this.ciudadanoService.actualizarCargo(cargo.id, datos).subscribe({
      next: async () => {
        await this.mostrarToast(`Estado actualizado a: ${this.estadoLegible(nuevoEstado)}`);
        cargo.service_status_original = nuevoEstado;
        this.cargarDatos(this.ciudadano.id);
      },
      error: async (err) => {
        console.error('❌ Error al actualizar estado:', err);
        await this.mostrarToastError('Error al actualizar el estado');
        // Revertir en caso de error
        cargo.service_status = cargo.service_status_original;
      }
    });
  }

  // Mostrar estado legible en UI
  estadoLegible(status: string): string {
    switch (status) {
      case 'en_curso':
        return 'En curso';
      case 'completado':
        return 'Completado';
      case 'inconcluso':
        return 'Inconcluso';
      case 'rechazado':
        return 'Rechazó';
      default:
        return status;
    }
  }

  // ✅ Promover ciudadano a la siguiente orden
  async promoverOrden() {
    const alert = await this.alertController.create({
      header: 'Promover Orden',
      message: '¿Está seguro que desea promover al ciudadano a la siguiente orden?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Promover',
          handler: () => {
            this.ciudadanoService.promoverOrden(this.ciudadano.id).subscribe({
              next: async () => {
                await this.mostrarToast('Ciudadano promovido correctamente');
                this.cargarOrdenesDesbloqueadas(this.ciudadano.id);
              },
              error: async (err) => {
                console.error('❌ Error al promover:', err);
                await this.mostrarToastError(err.error?.message || 'Error al promover ciudadano');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // ✅ Retroceder ciudadano a la orden anterior
  async retrocederOrden() {
    const alert = await this.alertController.create({
      header: 'Retroceder Orden',
      message: '¿Está seguro que desea retroceder al ciudadano a la orden anterior?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Retroceder',
          handler: () => {
            this.ciudadanoService.retrocederOrden(this.ciudadano.id).subscribe({
              next: async () => {
                await this.mostrarToast('Ciudadano retrocedido correctamente');
                this.cargarOrdenesDesbloqueadas(this.ciudadano.id);
              },
              error: async (err) => {
                console.error('❌ Error al retroceder:', err);
                await this.mostrarToastError(err.error?.message || 'Error al retroceder ciudadano');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  generarPDFGeneral() {
    const doc = new jsPDF();

    const c = this.ciudadano;

    if (!c) {
      console.error('No hay datos del ciudadano');
      return;
    }

    // Título
    doc.setFontSize(18);
    doc.text('Datos Generales del Ciudadano', 14, 15);

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(14, 18, 196, 18);

    // Nombre completo
    doc.setFontSize(12);
    doc.text(
      `Nombre: ${c.name} ${c.last_name_father} ${c.last_name_mother}`,
      14,
      30
    );

    // Datos en tabla
    autoTable(doc, {
      startY: 40,
      theme: 'grid',
      head: [['Datos', 'Información']],
      body: [
        ['Teléfono', c.phone || '-'],
        ['Teléfono Referencial', c.alternatePhone || '-'],
        [
          'Fecha de Nacimiento',
          c.birth_date
            ? new Date(c.birth_date).toLocaleDateString()
            : '-'
        ],
        ['Estado Civil', this.mostrarEstadoCivil(c)],
        ['Dirección', c.address || '-'],
        ['Ocupación', c.occupation || '-'],
        ['Observaciones', c.comment || 'No hay comentario']
      ],
    });

    // Guardar PDF
    doc.save(`Ciudadano_${c.name} ${c.last_name_father} ${c.last_name_mother}.pdf`);
  }
}
