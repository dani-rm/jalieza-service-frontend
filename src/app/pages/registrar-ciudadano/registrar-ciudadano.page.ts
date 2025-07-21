import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonLabel, IonButton, IonInput, IonSelect, IonSelectOption, IonHeader, IonTitle,
  IonToolbar, IonRow,IonItem, IonCol, IonGrid, IonIcon, IonCardHeader, IonCardTitle, IonCardContent,
  IonCard, IonButtons, IonModal, IonList,ToastController, IonSearchbar } from '@ionic/angular/standalone';
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
  imports: [IonSearchbar, IonList, IonModal, IonButtons,
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
resetFormularioPrincipal() {
  this.nombres = '';
  this.apellidoPaterno = '';
  this.apellidoMaterno = '';
  this.telefono = '';
  this.fechaNacimiento = '';
  this.estadoCivil = '';
  this.parejaSeleccionada = null;
  this.busquedaPareja = '';
  this.ciudadanosFiltrados = [...this.personasDisponibles];
  this.mostrarBuscador = false;
}

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
     private toastController: ToastController,
    private location: Location,
    private ciudadanoService: CiudadanoService
  ) {
    addIcons({ calendar });
  }

  ngOnInit() {
    this.hoy = new Date().toISOString().split('T')[0];
    this.cargarPersonasDisponibles();
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
  volver() {
    this.location.back();
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

  abrirSelectorFecha(fechaInput: any) {
    const nativeInput = fechaInput?.getInputElement?.();
    if (nativeInput instanceof Promise) {
      nativeInput.then(input => input?.showPicker?.() || input?.focus());
    } else {
      nativeInput?.showPicker?.() || nativeInput?.focus();
    }
  }

  async soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
       await this.mostrarToastError('No se aceptan letras en este campo.');
    }
  }

  async soloLetras(event: KeyboardEvent) {
    const tecla = event.key;
    const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;
    if (!patron.test(tecla)) {
      event.preventDefault();
          await this.mostrarToastError('No se aceptan numeros en este campo.');
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
    name: this.nombres.trim(),
    last_name_father: this.apellidoPaterno.trim(),
    last_name_mother: this.apellidoMaterno.trim(),
    birth_date: this.fechaNacimiento,
    phone: this.telefono.trim(),
    marital_status: this.estadoCivil
  };

  if (partnerId) {
    dto.partner = partnerId;
  }

  console.log('DTO que se enviará:', dto);

  this.ciudadanoService.crearCiudadano(dto).subscribe({
    next: async (res) => {
      console.log('✅ Ciudadano registrado:', res);
      await this.mostrarToast('Ciudadano registrado correctamente');

      const ciudadanoId = res.data?.id;
      // 🔁 Si tiene pareja seleccionada, actualizamos también a la pareja
      if (partnerId && ciudadanoId) {
        this.ciudadanoService.actualizarCiudadano(partnerId, {
          partner: ciudadanoId
        }).subscribe({
          next: () => console.log(`🔁 Pareja actualizada con el ID de ${ciudadanoId}`),
          error: (err) => console.error('❌ Error al actualizar pareja:', err)
        });
      }

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
    error: async (err) => {
      console.error('❌ Error al registrar ciudadano:', err);
      await this.mostrarToastError('Ocurrió un error al registrar al ciudadano.');
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

  this.ciudadanoService.crearCiudadano(nuevaPareja).subscribe({
    next: async (res) => {
      console.log('✅ Pareja registrada:', res);
       await this.mostrarToast('Pateja registrada correctamente');

      // Actualiza lista para seleccionar
      this.cargarPersonasDisponibles();

      // Selecciona automáticamente a la nueva pareja
      this.parejaSeleccionada = res.data || null;
      this.registrarCiudadano();

      // Limpia campos y cierra formulario
      this.nombresPareja = '';
      this.apellidoPaternoPareja = '';
      this.apellidoMaternoPareja = '';
      this.telefonoPareja = '';
      this.fechaNacimientoPareja = '';
      this.estadoCivilPareja = '';
      this.mostrarFormularioPareja = false;

    },
    error: async(err) => {
      console.error('❌ Error al registrar pareja:', err);
       await this.mostrarToastError('Ocurrió un error al registrar la pareja.');
    }
  });

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

onSearchChange(event: any) {
  this.busquedaPareja = event.detail.value;
  this.filtrarPersonasDirecto(event);
}


}
