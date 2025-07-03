import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonRow, IonCol, IonLabel, IonGrid,
  IonSelectOption, IonIcon, IonSelect, IonCard, IonCardContent, IonInput, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';

@Component({
  selector: 'app-editar-datos-generales-ciudadano',
  templateUrl: './editar-datos-generales-ciudadano.page.html',
  styleUrls: ['./editar-datos-generales-ciudadano.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCardHeader, IonInput, IonCardContent, IonCard, IonIcon, IonGrid, IonLabel,
    IonCol, IonRow, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    NavbarComponent, FooterComponent, IonSelect, IonSelectOption]
})
export class EditarDatosGeneralesCiudadanoPage implements OnInit {
  usuario: any;
  estadoCivil: string = '';
  parejaSeleccionada: string = '';
  personasDisponibles: string[] = [];
  mostrarFormularioPareja: boolean = false;

  estadosConPareja = ['Casado', 'Divorciado', 'Viudo'];

  constructor(private location: Location, private usuarioService: UsuarioService) {
    addIcons({ calendar });
  }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuario();
    if (this.usuario) {
      this.estadoCivil = this.usuario.estadoCivil;
      this.parejaSeleccionada = this.usuario.pareja;
    }

    this.cargarPersonasDisponibles();

    // Si la pareja no está en la lista, agregarla al final
    if (
      this.parejaSeleccionada &&
      !this.personasDisponibles.includes(this.parejaSeleccionada)
    ) {
      this.personasDisponibles.push(this.parejaSeleccionada);
    }
  }

  volver() {
    this.location.back();
  }

  cargarPersonasDisponibles() {
    const usuarios = this.usuarioService.getUsuarios();

    // Nombre completo de la pareja seleccionada
    const parejaActual = this.usuario?.pareja;

    this.personasDisponibles = usuarios
      // Filtramos solteros o quien sea la pareja actual
      .filter(user =>
        user.estadoCivil === 'Soltero' ||
        `${user.nombres} ${user.apellidoPaterno} ${user.apellidoMaterno}` === parejaActual
      )
      .map(user => `${user.nombres} ${user.apellidoPaterno} ${user.apellidoMaterno}`);
  }

  onEstadoCivilChange() {
    if (!this.estadosConPareja.includes(this.estadoCivil)) {
      this.parejaSeleccionada = '';
      this.mostrarFormularioPareja = false;
    }
  }

  verificarSeleccion() {
    this.mostrarFormularioPareja = this.parejaSeleccionada === 'registrar';
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

  cerrarFormularioPareja() {
    this.mostrarFormularioPareja = false;
    this.parejaSeleccionada = '';
  }
}
