import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonLabel, IonButton, IonInput, IonSelect, IonSelectOption, IonHeader, IonTitle,
  IonToolbar, IonRow,IonItem, IonCol, IonGrid, IonIcon, IonCardHeader, IonCardTitle, IonCardContent,
  IonCard, IonButtons, IonModal, IonList } from '@ionic/angular/standalone';
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
  imports: [IonList, IonModal, IonButtons,
    IonCard, IonCardContent,IonItem, IonCardTitle, IonCardHeader, IonIcon, IonGrid, IonCol,
    IonRow, IonToolbar, IonTitle, IonHeader, IonInput, IonButton, IonLabel, IonContent,
    CommonModule, FormsModule, NavbarComponent, FooterComponent, IonSelect, IonSelectOption
  ]
})

export class RegistrarCiudadanoPage implements OnInit {
  // Variables de pareja
  nombresPareja = '';
  apellidoPaternoPareja = '';
  apellidoMaternoPareja = '';
  telefonoPareja = '';
  fechaNacimientoPareja = '';
  estadoCivilPareja = '';

  hoy = '';

  // Datos del ciudadano a registrar
  nombres = '';
  apellidoPaterno = '';
  apellidoMaterno = '';
  telefono = '';
  fechaNacimiento = '';
  estadoCivil = '';

  parejaSeleccionada: any = null;  // 🔥 ¡CAMBIADO!
  ciudadanosDisponibles: any[] = [];
  personasDisponibles: any[] = []; // 🔥 ¡YA NO string[]!
  mostrarFormularioPareja = false;
  estadosConPareja = ['Casado', 'Divorciado', 'Viudo'];

  // Modal buscador de pareja
  modalAbierto = false;
  busquedaPareja = '';
  personasFiltradas: any[] = [];
  mostrarBuscador = false;
ciudadanos = [];

  mostrarBuscadorPareja = false;
searchTerm = '';
ciudadanosFiltrados = [...this.personasDisponibles];

  constructor(
    private location: Location,
    private ciudadanoService: CiudadanoService
  ) {
    addIcons({ calendar });
  }

  ngOnInit() {
    this.hoy = new Date().toISOString().split('T')[0];
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
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      alert("No se permiten letras en este campo");
    }
  }

  soloLetras(event: KeyboardEvent) {
    const tecla = event.key;
    const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;
    if (!patron.test(tecla)) {
      event.preventDefault();
      alert("No se aceptan números en este campo");
    }
  }

 cargarPersonasDisponibles() {
  this.ciudadanoService.getCiudadanos().subscribe((ciudadanos) => {
    this.ciudadanosDisponibles = ciudadanos;
    this.personasDisponibles = ciudadanos.filter(c => c.marital_status === 'Soltero');
    this.ciudadanosFiltrados = [...this.personasDisponibles]; // 🔥 aquí es el momento correcto
  });
}

  compararPersonas(p1: any, p2: any): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  onEstadoCivilChange() {
    if (!this.estadosConPareja.includes(this.estadoCivil)) {
      this.parejaSeleccionada = null;
      this.mostrarFormularioPareja = false;
    }
  }

  verificarSeleccion() {
    if (this.parejaSeleccionada === 'registrar') {
      this.mostrarFormularioPareja = true;
    } else {
      this.mostrarFormularioPareja = false;
    }
  }

  cerrarFormularioPareja() {
    this.mostrarFormularioPareja = false;
    this.parejaSeleccionada = null;
  }


  cerrarModal() {
    this.modalAbierto = false;
  }
  filtrarPersonasDirecto(event: any) {
  const filtro = event.target.value.toLowerCase().trim();
  this.ciudadanosFiltrados = this.personasDisponibles.filter(p =>
    (`${p.name} ${p.last_name_father} ${p.last_name_mother}`).toLowerCase().includes(filtro)
  );
}

filtrarPersonas() {
  const filtro = this.busquedaPareja.toLowerCase().trim();
  this.ciudadanosFiltrados = this.personasDisponibles.filter(p =>
    (`${p.name} ${p.last_name_father} ${p.last_name_mother}`).toLowerCase().includes(filtro)
  );
}


  get isFormValid(): boolean {
    const basicValid = this.nombres.trim() !== '' &&
      this.apellidoPaterno.trim() !== '' &&
      this.apellidoMaterno.trim() !== '' &&
      this.telefono.trim() !== '' &&
      this.fechaNacimiento.trim() !== '' &&
      this.estadoCivil.trim() !== '';

    if (this.estadosConPareja.includes(this.estadoCivil)) {
      return basicValid && this.parejaSeleccionada && this.parejaSeleccionada !== 'registrar';
    }

    return basicValid;
  }

  registrarCiudadano() {
    if (!this.isFormValid) return;

    const partnerId = this.estadosConPareja.includes(this.estadoCivil) &&
      this.parejaSeleccionada && this.parejaSeleccionada !== 'registrar'
      ? this.parejaSeleccionada.id
      : undefined;

    const dto: any = {
      name: this.nombres,
      last_name_father: this.apellidoPaterno,
      last_name_mother: this.apellidoMaterno,
      birth_date: this.fechaNacimiento,
      phone: this.telefono,
      marital_status: this.estadoCivil
    };

    if (partnerId) dto.partner = partnerId;

    console.log('DTO que se enviará:', dto);

    this.ciudadanoService.crearCiudadano(dto).subscribe({
      next: (res) => {
        console.log('✅ Ciudadano registrado:', res);
        alert('Ciudadano registrado correctamente');

        // Limpiar campos
        this.nombres = '';
        this.apellidoPaterno = '';
        this.apellidoMaterno = '';
        this.fechaNacimiento = '';
        this.telefono = '';
        this.estadoCivil = '';
        this.parejaSeleccionada = null;
        this.mostrarFormularioPareja = false;

        this.cargarPersonasDisponibles();
      },
      error: (err) => {
        console.error('❌ Error al registrar ciudadano:', err);
        alert('Ocurrió un error al registrar al ciudadano.');
      }
    });
  }

  registrarPareja() {
    const nuevaPareja = {
      name: this.nombresPareja,
      last_name_father: this.apellidoPaternoPareja,
      last_name_mother: this.apellidoMaternoPareja,
      birth_date: this.fechaNacimientoPareja,
      phone: this.telefonoPareja,
      marital_status: this.estadoCivilPareja
    };

    console.log('Registrando pareja:', nuevaPareja);

    // En producción: llamar a this.ciudadanoService.crearCiudadano(nuevaPareja)
    // y al éxito: cargar de nuevo las personasDisponibles y asignar automáticamente como pareja.
  }

abrirBuscador() {
  this.busquedaPareja = '';
  this.ciudadanosFiltrados = [...this.personasDisponibles]; // copia completa
  this.mostrarBuscador = true;
}
cerrarBuscador() {
  this.mostrarBuscadorPareja = false;
}

filtrarCiudadanos() {
  const term = this.searchTerm.toLowerCase();
  this.ciudadanosFiltrados = this.personasDisponibles.filter(c =>
    c.name?.toLowerCase().includes(term) ||
    c.last_name_father?.toLowerCase().includes(term) ||
    c.last_name_mother?.toLowerCase().includes(term)
  );
}

seleccionarPareja(persona: any) {
  this.parejaSeleccionada = persona;
  this.verificarSeleccion();
  this.cerrarBuscador();
}

}
