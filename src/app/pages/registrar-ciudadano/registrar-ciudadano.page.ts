import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonLabel, IonButton, IonInput, IonSelect, IonSelectOption, IonHeader, IonTitle,
  IonToolbar, IonRow, IonCol, IonGrid, IonIcon, IonCardHeader, IonCardTitle, IonCardContent,
  IonCard
} from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { FooterComponent } from './../../components/footer/footer.component';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { CiudadanoService } from 'src/app/services/ciudadano.service';

@Component({
  selector: 'app-registrar-ciudadano',
  templateUrl: './registrar-ciudadano.page.html',
  styleUrls: ['./registrar-ciudadano.page.scss'],
  standalone: true,
  imports: [
    IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonIcon, IonGrid, IonCol,
    IonRow, IonToolbar, IonTitle, IonHeader, IonInput, IonButton, IonLabel, IonContent,
    CommonModule, FormsModule, NavbarComponent, FooterComponent, IonSelect, IonSelectOption
  ]
})
export class RegistrarCiudadanoPage implements OnInit {
  hoy='';

  fechaNacimiento = '';
  estadoCivil = '';
  parejaSeleccionada = '';
  ciudadanosDisponibles: any[] = [];
  personasDisponibles: string[] = [];
  mostrarFormularioPareja = false;
  estadosConPareja = ['Casado', 'Divorciado', 'Viudo'];

  // Campos del formulario
  nombres = '';
  apellidoPaterno = '';
  apellidoMaterno = '';
  telefono = '';

  constructor(
    private location: Location,
    private ciudadanoService: CiudadanoService
  ) {
    addIcons({ calendar });
  }

  ngOnInit() {
    this.hoy = new Date().toISOString().split('T')[0]; // formato yyyy-MM-dd
    this.cargarPersonasDisponibles();
  }

  volver() {
    this.location.back();
  }

  abrirSelectorFecha(fechaInput: any) {
    const nativeInput = fechaInput?.getInputElement?.();
    if (nativeInput instanceof Promise) {
      nativeInput.then(input => input?.showPicker?.() || input?.focus());
    } else {
      nativeInput?.showPicker?.() || nativeInput?.focus();
    }
  }

  soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permite solo dígitos (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }



  cargarPersonasDisponibles() {
    this.ciudadanoService.getCiudadanos().subscribe((ciudadanos) => {
      this.ciudadanosDisponibles = ciudadanos;

      this.personasDisponibles = ciudadanos
        .filter(c => c.marital_status === 'Soltero')
        .map(c => `${c.name} ${c.last_name_father} ${c.last_name_mother}`);
    });
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

  cerrarFormularioPareja() {
    this.mostrarFormularioPareja = false;
    this.parejaSeleccionada = '';
  }

  get isFormValid(): boolean {
    const basicValid = this.nombres.trim() !== '' &&
      this.apellidoPaterno.trim() !== '' &&
      this.apellidoMaterno.trim() !== '' &&
      this.telefono.trim() !== '' &&
      this.fechaNacimiento.trim() !== '' &&
      this.estadoCivil.trim() !== '';

    if (this.estadosConPareja.includes(this.estadoCivil)) {
      return basicValid && this.parejaSeleccionada.trim() !== '';
    }

    return basicValid;
  }

 registrarCiudadano() {
  if (!this.isFormValid) return;

  let partnerId: number | undefined = undefined;

  if (this.estadosConPareja.includes(this.estadoCivil) && this.parejaSeleccionada !== 'registrar') {
    const pareja = this.ciudadanosDisponibles.find(
      c => `${c.name} ${c.last_name_father} ${c.last_name_mother}` === this.parejaSeleccionada
    );
    partnerId = pareja?.id;
  }

  const dto = {
    name: this.nombres,
    last_name_father: this.apellidoPaterno,
    last_name_mother: this.apellidoMaterno,
    birth_date: this.fechaNacimiento,
    phone: this.telefono,
    marital_status: this.estadoCivil,
    ...(partnerId ? { partner: partnerId } : {})
  };

  console.log('DTO que se enviará:', dto);

  this.ciudadanoService.crearCiudadano(dto).subscribe({
    next: (res) => {
      console.log('✅ Ciudadano registrado:', res);
      alert('Ciudadano registrado correctamente');

      // 👉 Limpiar todos los campos del formulario
      this.nombres = '';
      this.apellidoPaterno = '';
      this.apellidoMaterno = '';
      this.fechaNacimiento = '';
      this.telefono = '';
      this.estadoCivil = '';
      this.parejaSeleccionada = '';
      this.mostrarFormularioPareja = false;

      // 👉 Opcional: recargar lista de ciudadanos disponibles (por si se registró una pareja nueva)
      this.cargarPersonasDisponibles();
    },
    error: (err) => {
      console.error('❌ Error al registrar ciudadano:', err);
      alert('Ocurrió un error al registrar al ciudadano.');
    }
  });
}

}
