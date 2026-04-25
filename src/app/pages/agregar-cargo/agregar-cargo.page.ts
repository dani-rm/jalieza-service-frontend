import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonItem, IonGrid, IonLabel,
  IonButton, IonSelect, IonSelectOption, IonInput, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { OrdenDisponible, ServicioDisponible, AsignacionServicio, ServicioCompleto, OrdenesDisponiblesResponse } from 'src/app/interfaces/servicios.interface';
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
    IonContent, IonTitle, IonToolbar, CommonModule, FormsModule,
    NavbarComponent, IonSelect, IonSelectOption
  ]
})
export class AgregarCargoPage implements OnInit {

  ciudadano: Ciudadano | null = null;
  ciudadanoId: number = 1;

  // ✅ Variables para órdenes desbloqueadas
  ordenesDesbloqueadas: { id: number; order_name: string }[] = [];
  maxOrdenDesbloqueada: number = 0;

  // ✅ Variables para el catálogo de servicios
  serviciosCatalogo: ServicioCompleto[] = [];
  serviciosFiltrados: ServicioCompleto[] = [];
  ordenSeleccionadoId: number | null = null;
  servicioSeleccionadoId: number | null = null;

  start_date: string = '';
  observations: string = '';
  // Estado inicial del cargo (null para mostrar placeholder "Seleccionar")
  initialStatus: 'en_curso' | 'rechazado' | null = null;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private ciudadanoService: CiudadanoService,
    private toastController: ToastController,
    private router: Router
  ) {
    addIcons({ calendar });
  }
  ngOnInit() {
    // Obtener id del ciudadano de la ruta
    this.ciudadanoId = +this.route.snapshot.paramMap.get('id')!;

    // Cargar datos del ciudadano, órdenes desbloqueadas y catálogo de servicios
    this.cargarCiudadano();
    this.cargarOrdenesDesbloqueadas();
    this.cargarCatalogoServicios();
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

  // ✅ Cargar órdenes desbloqueadas para el ciudadano
  cargarOrdenesDesbloqueadas() {
    console.log('🔍 Cargando órdenes desbloqueadas para ciudadano ID:', this.ciudadanoId);
    this.ciudadanoService.getOrdenesDisponibles(this.ciudadanoId).subscribe({
      next: (response: any) => {
        this.maxOrdenDesbloqueada = response.max_orden_desbloqueada;
        this.ordenesDesbloqueadas = response.ordenes_disponibles.map((orden: any) => ({
          id: orden.id,
          order_name: orden.order_name
        }));
        console.log('� Órdenes desbloqueadas:', this.ordenesDesbloqueadas);
        console.log('📊 Máxima orden desbloqueada:', this.maxOrdenDesbloqueada);
      },
      error: (err) => {
        console.error('❌ Error al cargar órdenes desbloqueadas:', err);
        this.mostrarToastError('No se pudieron cargar las órdenes disponibles');
      }
    });
  }

  // ✅ Cargar catálogo completo de servicios
  cargarCatalogoServicios() {
    console.log('🔍 Cargando catálogo de servicios...');
    this.ciudadanoService.getCatalogoServicios().subscribe({
      next: (servicios) => {
        this.serviciosCatalogo = servicios;
        console.log('📦 Catálogo de servicios recibido:', servicios);
        console.log('📊 Total de servicios:', servicios?.length);
      },
      error: (err) => {
        console.error('❌ Error al cargar catálogo de servicios:', err);
        console.error('❌ Detalles del error:', err.error);
        console.error('❌ Status:', err.status);
        this.mostrarToastError('No se pudieron cargar los servicios disponibles');
      }
    });
  }

  // ✅ Al seleccionar orden, filtrar servicios de esa orden (solo órdenes desbloqueadas)
  onOrdenSeleccionado() {
    // Verificar que la orden esté desbloqueada
    const ordenDesbloqueada = this.ordenesDesbloqueadas.find(o => o.id === this.ordenSeleccionadoId);

    if (!ordenDesbloqueada) {
      console.warn('⚠️ Orden no desbloqueada seleccionada');
      this.serviciosFiltrados = [];
      this.servicioSeleccionadoId = null;
      return;
    }

    this.serviciosFiltrados = this.serviciosCatalogo.filter(
      servicio => servicio.order.id === this.ordenSeleccionadoId
    );
    this.servicioSeleccionadoId = null; // Reinicia el servicio seleccionado
    console.log('🔍 Orden seleccionada ID:', this.ordenSeleccionadoId);
    console.log('🛠 Servicios filtrados:', this.serviciosFiltrados);
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

    // Si no selecciona estado, por defecto se registra como 'en_curso'
    const status: 'en_curso' | 'rechazado' = this.initialStatus ?? 'en_curso';

    const datos: AsignacionServicio = {
      ciudadano_id: this.ciudadanoId,
      service_id: this.servicioSeleccionadoId,
      start_date: this.start_date,
      service_status: status,
      observations: this.observations || ''
    };

    console.log('Datos a enviar:', datos);

    this.ciudadanoService.asignarServicio(datos).subscribe({
      next: async () => {
        console.log('✅ Servicio asignado correctamente');
        await this.mostrarToast('Servicio asignado correctamente');
        localStorage.setItem('cargoActualizado', 'true');

        // Cambiar a la sección de Cargos
        this.router.navigate(['/ciudadano', this.ciudadanoId], { queryParams: { seccion: 'Cargos' } });
      },
      error: async (err) => {
        console.error('❌ Error al asignar servicio:', err);
        this.mostrarToastError('Error al asignar servicio');
      }
    });
  }

}