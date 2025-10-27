import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonItem, IonGrid, IonLabel,
  IonButton, IonSelect, IonSelectOption, IonInput, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { OrdenDisponible, ServicioDisponible, AsignacionServicio } from 'src/app/interfaces/servicios.interface';
interface Ciudadano {
  id: number;
  name: string;
  last_name_father: string;
  last_name_mother: string;
  birth_date: string;
}

@Component({
  selector: 'app-agregar-cargo',
  templateUrl: './agregar-cargo.page.html',
  styleUrls: ['./agregar-cargo.page.scss'],
  standalone: true,
  imports: [
    IonIcon, IonInput, IonButton, IonLabel, IonGrid, IonItem, IonRow, IonCol,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    NavbarComponent, IonSelect, IonSelectOption
  ]
})
export class AgregarCargoPage implements OnInit {

  ciudadano: Ciudadano | null = null;
  ciudadanoId: number = 1;
  
  // ✅ NUEVAS VARIABLES CON TIPADO CORRECTO
  ordenesDisponibles: OrdenDisponible[] = [];
  serviciosDisponibles: ServicioDisponible[] = [];
  ordenSeleccionadoId: number | null = null;
  servicioSeleccionadoId: number | null = null;

  start_date: string = '';
  observations: string = '';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private ciudadanoService: CiudadanoService,
    private toastController: ToastController
  ) {
    addIcons({ calendar });
  }
ngOnInit() {
  // Obtener id del ciudadano de la ruta
  this.ciudadanoId = +this.route.snapshot.paramMap.get('id')!;
  
  // Cargar datos del ciudadano y órdenes disponibles
  this.cargarCiudadano();
  this.cargarOrdenesDisponibles();
}
  calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

  // ✅ NUEVO: Cargar ciudadano
  cargarCiudadano() {
    this.ciudadanoService.getCiudadanoPorId(this.ciudadanoId).subscribe({
      next: (data) => {
        this.ciudadano = data;
        console.log('👤 Ciudadano cargado:', data);
      },
      error: (err) => {
        console.error('❌ Error al cargar ciudadano:', err);
      }
    });
  }

  // ✅ NUEVO: Cargar órdenes disponibles para el ciudadano
  cargarOrdenesDisponibles() {
    this.ciudadanoService.getOrdenesDisponibles(this.ciudadanoId).subscribe({
      next: (ordenes) => {
        this.ordenesDisponibles = ordenes;
        console.log('📦 Órdenes disponibles:', ordenes);
      },
      error: (err) => {
        console.error('❌ Error al cargar órdenes disponibles:', err);
      }
    });
  }

  // ✅ ACTUALIZADO: Al seleccionar orden, cargar sus servicios
  onOrdenSeleccionado() {
    const orden = this.ordenesDisponibles.find(o => o.id === this.ordenSeleccionadoId);
    this.serviciosDisponibles = orden?.services || [];
    this.servicioSeleccionadoId = null; // Reinicia el servicio seleccionado
    console.log('🔍 Orden seleccionada:', orden);
    console.log('🛠 Servicios disponibles:', orden?.services);
  }

  abrirSelectorFecha(fechaInput: any) {
    const nativeInput = fechaInput?.getInputElement?.();
    if (nativeInput instanceof Promise) {
      nativeInput.then(input => input?.showPicker?.() || input?.focus());
    } else {
      nativeInput?.showPicker?.() || nativeInput?.focus();
    }
  }

  volver() {
    this.location.back();
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


  // ✅ ACTUALIZADO: Asignar servicio con nueva estructura
  asignarServicio() {
    if (!this.servicioSeleccionadoId || !this.start_date) {
      console.error('❌ Faltan campos obligatorios');
      this.mostrarToastError('Complete todos los campos obligatorios');
      return;
    }

    // ✅ Validación de edad solo si la fecha de nacimiento está disponible
    if (this.ciudadano?.birth_date) {
      const edad = this.calcularEdad(this.ciudadano.birth_date);
      if (edad < 18 || edad > 70) {
        this.mostrarToastError(`El ciudadano tiene ${edad} años y no cumple con el rango permitido (18-70).`);
        return;
      }
    }

    const datos: AsignacionServicio = {
      ciudadano_id: this.ciudadanoId,
      service_id: this.servicioSeleccionadoId,
      start_date: this.start_date,
      service_status: 'en_curso',
      observations: this.observations || ''
    };

    console.log('Datos a enviar:', datos);

    this.ciudadanoService.asignarServicio(datos).subscribe({
      next: async () => {
        console.log('✅ Servicio asignado correctamente');
        await this.mostrarToast('Servicio asignado correctamente');
        localStorage.setItem('cargoActualizado', 'true');

        // Vuelve atrás y luego recarga para ver los cambios
        this.location.back();

        setTimeout(() => {
          window.location.reload(); // 🔄 Recarga tras regresar
        }, 300);
      },
      error: async (err) => {
        console.error('❌ Error al asignar servicio:', err);
        this.mostrarToastError('Error al asignar servicio');
      }
    });
  }

}
