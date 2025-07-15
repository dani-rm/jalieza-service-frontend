import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonGrid,
  IonRow, IonCol, IonLabel, IonIcon, IonItem, IonSelect, IonInput, IonSelectOption
} from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { Location } from '@angular/common';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';

@Component({
  selector: 'app-editar-cargos-ciudadano',
  templateUrl: './editar-cargos-ciudadano.page.html',
  styleUrls: ['./editar-cargos-ciudadano.page.scss'],
  standalone: true,
  imports: [
    IonInput, IonItem, IonIcon, IonLabel, IonCol, IonRow, IonGrid, IonButton,
    IonContent, IonHeader, IonTitle, IonToolbar, IonSelectOption, CommonModule,
    FormsModule, NavbarComponent, IonSelect, ReactiveFormsModule, FooterComponent
  ]
})
export class EditarCargosCiudadanoPage implements OnInit {
  ciudadano: any;
  cargos: any[] = [];

  ordenes = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto', 'Sexto'];
  estados = ['Completado', 'En Curso', 'Inconcluso'];

  cargoSeleccionadoId: number | null = null;

  ordenSeleccionado: string = '';
  nombreSeleccionado: string = '';
  start_date: string = '';
  end_date: string = '';
  estadoSeleccionado: string = '';

  actualizarHabilitado = false;

  constructor(
    private location: Location,
    private ciudadanoService: CiudadanoService
  ) {
    addIcons({ calendar });
  }

  ngOnInit() {
    this.ciudadano = this.ciudadanoService.getCiudadanoSeleccionado();
    if (this.ciudadano) {
      this.cargarCargos(this.ciudadano.id);
    } else {
      console.warn('⚠️ No se encontró ciudadano en sesión');
    }
  }

  cargarCargos(id: number) {
    this.ciudadanoService.getCargosDelCiudadano(id).subscribe({
      next: (cargos) => {
        this.cargos = cargos;
      },
      error: (err) => {
        console.error('❌ Error al obtener cargos:', err);
      }
    });
  }

  onCargoChange() {
    const cargo = this.cargos.find(c => c.id === this.cargoSeleccionadoId);
    if (cargo) {
      this.ordenSeleccionado = cargo.orden;
      this.nombreSeleccionado = cargo.servicio?.nombre || '';
      this.start_date = cargo.start_date?.split('T')[0] || '';
      this.end_date = cargo.end_date?.split('T')[0] || '';
      this.estadoSeleccionado = cargo.termination_status;
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
    this.actualizarHabilitado = false;
  }

  actualizarCargo() {
    if (!this.actualizarHabilitado || !this.cargoSeleccionadoId) return;

    const cargo = this.cargos.find(c => c.id === this.cargoSeleccionadoId);
    if (!cargo) return;

    const datos = {
      service_id: cargo.service_id, // no editamos tipo de cargo aún
      start_date: this.start_date,
      end_date: this.end_date,
      termination_status: this.estadoSeleccionado,
      observations: ''
    };

    this.ciudadanoService.actualizarCargo(this.cargoSeleccionadoId, datos).subscribe({
      next: () => {
        alert('✅ Cargo actualizado con éxito');
        this.location.back();
      },
      error: (err) => {
        console.error('❌ Error al actualizar cargo:', err);
        alert('❌ No se pudo actualizar el cargo');
      }
    });
  }

  volver() {
    this.location.back();
  }
}
