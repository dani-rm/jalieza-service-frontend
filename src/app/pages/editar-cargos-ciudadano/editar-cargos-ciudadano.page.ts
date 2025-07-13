import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonLabel,
  IonIcon, IonItem, IonSelect, IonInput, IonSelectOption } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { Location } from '@angular/common';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';

@Component({
  selector: 'app-editar-cargos-ciudadano',
  templateUrl: './editar-cargos-ciudadano.page.html',
  styleUrls: ['./editar-cargos-ciudadano.page.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonIcon, IonLabel, IonCol, IonRow, IonGrid, IonButton, IonContent, IonHeader,
    IonTitle, IonToolbar, IonSelectOption, CommonModule, FormsModule, NavbarComponent, FormsModule, IonSelect,
    ReactiveFormsModule, FooterComponent]
})
export class EditarCargosCiudadanoPage implements OnInit {
  cargos = [
    { id: 1, orden: 'Primer', nombre: 'Cargo 1', start_date: '2023-01-01', end_date: '2023-06-30', estado: 'Completado' },
    { id: 2, orden: 'Segundo', nombre: 'Cargo 2', start_date: '2023-07-01', end_date: '2023-12-31', estado: 'En Curso' },
  ];

  ordenes = ['Primer', 'Segundo', 'Tercer', 'Cuarto', 'Quinto', 'Sexto'];
  estados = ['Completado', 'En Curso', 'Inconcluso'];

  cargoSeleccionadoId: number | null = null;

  // Datos binded para formulario
  ordenSeleccionado: string = '';
  nombreSeleccionado: string = '';
  start_date: string = '';
  end_date: string = '';
  estadoSeleccionado: string = '';

  actualizarHabilitado = false;

  constructor(private location: Location) {
    addIcons({ calendar });
  }

  ngOnInit() {}

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

  // Al cambiar cargo seleccionado, carga datos del cargo en el formulario
  onCargoChange() {
    if (this.cargoSeleccionadoId !== null) {
      const cargo = this.cargos.find(c => c.id === this.cargoSeleccionadoId);
      if (cargo) {
        this.ordenSeleccionado = cargo.orden;
        this.nombreSeleccionado = cargo.nombre;
        this.start_date = cargo.start_date;
        this.end_date = cargo.end_date;
        this.estadoSeleccionado = cargo.estado;
        this.actualizarHabilitado = false; // no hay cambios todavía
      }
    } else {
      // Limpiar campos si nada seleccionado
      this.limpiarCampos();
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

  // Detecta cambios para habilitar botón actualizar
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

  // Simula actualización y regresa
  actualizarCargo() {
    if (!this.actualizarHabilitado) return;

    // Aquí va llamada HTTP para actualizar cargo, pero por ahora simulo:
    const index = this.cargos.findIndex(c => c.id === this.cargoSeleccionadoId);
    if (index !== -1) {
      this.cargos[index] = {
        id: this.cargoSeleccionadoId!,
        orden: this.ordenSeleccionado,
        nombre: this.nombreSeleccionado,
        start_date: this.start_date,
        end_date: this.end_date,
        estado: this.estadoSeleccionado
      };
      alert('Cargo actualizado con éxito');
      this.volver();
    }
  }
}
