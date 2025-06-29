import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonButton, IonInput, IonSelect, IonSelectOption, IonHeader, IonTitle,
  IonToolbar, IonRow, IonCol, IonGrid, IonIcon, IonItem, IonCardHeader, IonCardTitle, IonCardContent,
  IonCard } from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { FooterComponent } from './../../components/footer/footer.component';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
@Component({
  selector: 'app-registrar-ciudadano',
  templateUrl: './registrar-ciudadano.page.html',
  styleUrls: ['./registrar-ciudadano.page.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonItem, IonIcon, IonGrid, IonCol,
    IonRow, IonToolbar, IonTitle, IonHeader, IonInput, IonButton, IonLabel, IonContent, CommonModule,
    FormsModule, NavbarComponent, FooterComponent, IonSelect, IonSelectOption]
})
export class RegistrarCiudadanoPage implements OnInit {
  constructor(private location: Location) {
    addIcons({calendar,});
  }

  ngOnInit() {
  }

  volver() {
    this.location.back();
  }

  fechaNacimiento = '';

  abrirSelectorFecha(fechaInput: any) {
    const nativeInput = fechaInput?.getInputElement?.();

    if (nativeInput instanceof Promise) {
      nativeInput.then(input => input?.showPicker?.() || input?.focus());
    } else {
      nativeInput?.showPicker?.() || nativeInput?.focus();
    }
  }

  estadoCivil = '';
  parejaSeleccionada = '';
  personasDisponibles = ['Juan Pérez', 'Ana García', 'Carlos López', 'María Torres'];

  onEstadoCivilChange() {
    if (this.estadoCivil !== 'casado') {
      this.parejaSeleccionada = '';
      this.mostrarFormularioPareja = false; // por si el usuario estaba registrando una pareja
    }
  }

  mostrarFormularioPareja = false;
  verificarSeleccion() {
    this.mostrarFormularioPareja = this.parejaSeleccionada === 'registrar';
  }

  cerrarFormularioPareja() {
    this.mostrarFormularioPareja = false;
    this.parejaSeleccionada = ''; // opcional: limpia selección si quieres
  }
}
