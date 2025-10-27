import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel,
  IonCol, IonGrid, IonRow, IonItem, IonInput, IonSelect, IonSelectOption,
  IonText, IonCard, IonCardContent, IonIcon, ToastController, IonButtons
} from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { CatalogoServiciosCrudService } from 'src/app/services/catalogo-servicios-crud.service';
import { ServicioCatalogo, CrearServicioRequest, ActualizarServicioRequest, Orden } from 'src/app/interfaces/catalogo-servicios.interface';
import { addIcons } from 'ionicons';
import { saveOutline, arrowBackOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-crear-editar-servicio',
  templateUrl: './crear-editar-servicio.page.html',
  styleUrls: ['./crear-editar-servicio.page.scss'],
  standalone: true,
  imports: [
    IonText, IonCardContent, IonCard, IonItem, IonIcon, IonButtons,
    IonRow, IonGrid, IonCol, IonLabel, IonButton, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,
    NavbarComponent, IonInput, IonSelect, IonSelectOption
  ]
})
export class CrearEditarServicioPage implements OnInit {

  // ✅ Variables de estado
  esEdicion: boolean = false;
  servicioId: number | null = null;
  servicio: ServicioCatalogo | null = null;
  ordenes: Orden[] = [];
  
  // ✅ Formulario reactivo
  servicioForm: FormGroup;
  
  // ✅ Variables de UI
  cargando: boolean = false;
  guardando: boolean = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private catalogoService: CatalogoServiciosCrudService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastController: ToastController
  ) {
    addIcons({ saveOutline, arrowBackOutline, checkmarkCircleOutline });
    
    // Inicializar formulario
    this.servicioForm = this.formBuilder.group({
      service_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      orden_id: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  // ✅ Cargar datos iniciales
  async cargarDatos() {
    this.cargando = true;
    this.error = null;

    try {
      // Obtener ID de la ruta
      const id = this.route.snapshot.paramMap.get('id');
      this.esEdicion = !!id;
      this.servicioId = id ? +id : null;

      // Cargar órdenes disponibles
      await this.cargarOrdenes();

      // Si es edición, cargar datos del servicio
      if (this.esEdicion && this.servicioId) {
        await this.cargarServicio();
      }

    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      this.error = 'Error al cargar los datos';
      await this.mostrarToastError('Error al cargar los datos');
    } finally {
      this.cargando = false;
    }
  }

  // ✅ Cargar órdenes disponibles
  async cargarOrdenes() {
    try {
      const ordenes = await this.catalogoService.getOrdenes().toPromise();
      this.ordenes = ordenes || [];
    } catch (error) {
      console.error('❌ Error al cargar órdenes:', error);
      throw error;
    }
  }

  // ✅ Cargar datos del servicio (solo en edición)
  async cargarServicio() {
    if (!this.servicioId) return;

    try {
      const servicio = await this.catalogoService.getServicioPorId(this.servicioId).toPromise();
      this.servicio = servicio || null;
      
      if (this.servicio) {
        this.servicioForm.patchValue({
          service_name: this.servicio.service_name,
          orden_id: this.servicio.order.id
        });
      }
    } catch (error) {
      console.error('❌ Error al cargar servicio:', error);
      throw error;
    }
  }

  // ✅ Guardar servicio
  async guardarServicio() {
    if (this.servicioForm.invalid) {
      this.marcarCamposComoTocados();
      await this.mostrarToastError('Por favor, complete todos los campos requeridos');
      return;
    }

    this.guardando = true;
    this.error = null;

    try {
      const formData = this.servicioForm.value;

      if (this.esEdicion && this.servicioId) {
        // Actualizar servicio existente
        const datosActualizacion: ActualizarServicioRequest = {
          service_name: formData.service_name,
          orden_id: formData.orden_id
        };

        await this.catalogoService.actualizarServicio(this.servicioId, datosActualizacion).toPromise();
        await this.mostrarToast('Servicio actualizado correctamente');
      } else {
        // Crear nuevo servicio
        const datosCreacion: CrearServicioRequest = {
          service_name: formData.service_name,
          orden_id: formData.orden_id
        };

        await this.catalogoService.crearServicio(datosCreacion).toPromise();
        await this.mostrarToast('Servicio creado correctamente');
      }

      // Navegar de vuelta
      this.router.navigate(['/catalogo-servicios']);

    } catch (error) {
      console.error('❌ Error al guardar servicio:', error);
      this.error = 'Error al guardar el servicio';
      await this.mostrarToastError('Error al guardar el servicio');
    } finally {
      this.guardando = false;
    }
  }

  // ✅ Marcar todos los campos como tocados para mostrar errores
  marcarCamposComoTocados() {
    Object.keys(this.servicioForm.controls).forEach(key => {
      this.servicioForm.get(key)?.markAsTouched();
    });
  }

  // ✅ Validar campo específico
  esCampoInvalido(campo: string): boolean {
    const control = this.servicioForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  // ✅ Obtener mensaje de error para un campo
  obtenerMensajeError(campo: string): string {
    const control = this.servicioForm.get(campo);
    
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Este campo es requerido';
    }
    
    if (control.errors['minlength']) {
      return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    
    if (control.errors['maxlength']) {
      return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  // ✅ Navegación
  volver() {
    this.location.back();
  }

  // ✅ Utilidades
  obtenerTitulo(): string {
    return this.esEdicion ? 'Editar Servicio' : 'Crear Servicio';
  }

  obtenerTextoBoton(): string {
    return this.esEdicion ? 'Actualizar' : 'Crear';
  }

  // ✅ Toasts
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }

  async mostrarToastError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  }
}
