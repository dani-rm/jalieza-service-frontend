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
import { UsuarioService } from 'src/app/services/usuario.service';
@Component({
  selector: 'app-registrar-ciudadano',
  templateUrl: './registrar-ciudadano.page.html',
  styleUrls: ['./registrar-ciudadano.page.scss'],
  standalone: true,
  imports: [IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonIcon, IonGrid, IonCol,
    IonRow, IonToolbar, IonTitle, IonHeader, IonInput, IonButton, IonLabel, IonContent, CommonModule,
    FormsModule, NavbarComponent, FooterComponent, IonSelect, IonSelectOption]
})
export class RegistrarCiudadanoPage implements OnInit {
  constructor(private location: Location, private usuarioService: UsuarioService) {
    addIcons({ calendar });
  }

  ngOnInit() {
    this.cargarPersonasDisponibles();
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
  personasDisponibles: string[] = [];
  cargarPersonasDisponibles() {
    const usuarios = this.usuarioService.getUsuarios();

    this.personasDisponibles = usuarios
      .filter(user => user.estadoCivil === 'Soltero')
      .map(user => `${user.nombres} ${user.apellidoPaterno} ${user.apellidoMaterno}`);
  }

  estadosConPareja = ['Casado', 'Divorciado', 'Viudo'];

  onEstadoCivilChange() {
    if (!this.estadosConPareja.includes(this.estadoCivil)) {
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
