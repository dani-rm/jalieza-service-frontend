import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,ToastController, IonHeader, IonTitle, IonToolbar, IonButton, IonGrid,
  IonRow, IonCol, IonLabel, IonIcon, IonItem, IonSelect, IonInput, IonSelectOption
} from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { Location } from '@angular/common';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-cargos-ciudadano',
  templateUrl: './editar-cargos-ciudadano.page.html',
  styleUrls: ['./editar-cargos-ciudadano.page.scss'],
  standalone: true,
  imports: [
    IonInput, IonItem, IonIcon, IonLabel, IonCol, IonRow, IonGrid, IonButton,
    IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, CommonModule,
    FormsModule, NavbarComponent, IonSelect, ReactiveFormsModule
  ]
})
export class EditarCargosCiudadanoPage implements OnInit {
  ciudadano: any=null;
  cargos: any[] = [];

  ordenes = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto', 'Sexto'];
  estados = ['completado', 'en_curso', 'inconcluso']

  cargoSeleccionadoId: number | null = null;

  ordenSeleccionado: string = '';
  nombreSeleccionado: string = '';
  start_date: string = '';
  end_date: string = '';
  estadoSeleccionado: string = '';

  actualizarHabilitado = false;
  observations: string = '';


  constructor(
     private toastController: ToastController,
      private route: ActivatedRoute,
    private location: Location,
    private ciudadanoService: CiudadanoService
  ) {
    addIcons({ calendar });
  }

  ngOnInit() {

      const id = Number(this.route.snapshot.paramMap.get('id'));
  if (!isNaN(id)) {
    this.cargarCargosDelCiudadano(id);
  } else {
    console.warn('⚠️ ID inválido en la URL');
  }
    this.ciudadano = this.ciudadanoService.getCiudadanoSeleccionado();
     console.log('Ciudadano cargado:', this.ciudadano);
    if (this.ciudadano) {
      this.cargarCargosDelCiudadano(this.ciudadano.id);
    } else {
      console.warn('⚠️ No se encontró ciudadano en sesión');
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
        this.cargarCargosDelCiudadano(ciudadanoId); // 2. Obtener cargos
      },
      error: (error) => {
        console.error('❌ Error al obtener ciudadano:', error);
      }
    });
  }
  cargarCargosDelCiudadano(id: number) {
    this.ciudadanoService.getCargosDelCiudadano(id).subscribe({
      next: (cargos) => {
         console.log('👉 Cargos recibidos:', cargos);
        this.cargos = cargos;
      },
      error: (err) => {
        console.error('❌ Error al obtener cargos:', err);
      }
    });
  }

  onCargoChange() {
    const cargo = this.cargos.find(c => c.id === this.cargoSeleccionadoId);
    console.log('Cargo seleccionado:', cargo);
console.log('Observaciones:', cargo.observations);
    if (cargo) {
      this.nombreSeleccionado = cargo.catalogoServicio?.service_name || '';
    this.ordenSeleccionado = cargo.catalogoServicio?.order?.order_name || '';

      this.start_date = cargo.start_date?.split('T')[0] || '';
      this.end_date = cargo.end_date?.split('T')[0] || '';
      this.estadoSeleccionado = cargo.termination_status;
      this.observations = cargo.observations || '';

      this.actualizarHabilitado = false;
    } else {
      this.limpiarCampos();
    }
  }

  onInputChange() {
    this.actualizarHabilitado = !!(
      this.cargoSeleccionadoId &&
      this.ordenSeleccionado &&
      this.nombreSeleccionado &&
      this.start_date &&
      this.end_date &&
      this.estadoSeleccionado
    );
  }

  abrirSelectorFecha(fechaInput: any) {
    const nativeInput = fechaInput?.getInputElement?.();
    if (nativeInput instanceof Promise) {
      nativeInput.then(input => input?.showPicker?.() || input?.focus());
    } else {
      nativeInput?.showPicker?.() || nativeInput?.focus();
    }
  }

  limpiarCampos() {
    this.ordenSeleccionado = '';
    this.nombreSeleccionado = '';
    this.start_date = '';
    this.end_date = '';
    this.estadoSeleccionado = '';
    this.observations = '';

    this.actualizarHabilitado = false;
  }

  actualizarCargo() {
    if (!this.actualizarHabilitado || !this.cargoSeleccionadoId) return;

    const cargo = this.cargos.find(c => c.id === this.cargoSeleccionadoId);
    if (!cargo) return;

    const datos = {
      service_id: cargo.catalogoServicio.id, // no editamos tipo de cargo aún
      start_date: this.start_date,
      end_date: this.end_date,
      termination_status: this.estadoSeleccionado,
      observations: this.observations
    };
console.log('🔍 Datos a enviar:', datos);

    this.ciudadanoService.actualizarCargo(this.cargoSeleccionadoId, datos).subscribe({
      next: async () => {
        await this.mostrarToast('Cargo actualizado con exito')
             this.location.back();
setTimeout(() => {
  window.location.reload();
}, 300); // Espera a que regrese para recargar

      },


      error: async (err) => {
        console.error('❌ Error al actualizar cargo:', err);
        await this.mostrarToastError('No se pudo actualizar el cargo')
      }
    });
  }

  volver() {
    this.location.back();
  }
}
