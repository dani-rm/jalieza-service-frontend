import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonLabel, IonButton, IonInput, IonSelect, IonSelectOption, IonHeader, IonTitle,
  IonToolbar, IonRow,IonItem, IonCol, IonGrid, IonIcon, IonCardHeader, IonCardTitle, IonCardContent,
  IonCard, IonList,ToastController, IonSearchbar } from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-ciudadano',
  templateUrl: './registrar-ciudadano.page.html',
  styleUrls: ['./registrar-ciudadano.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonList,
    IonCard, IonCardContent,IonItem, IonCardTitle, IonCardHeader, IonIcon, IonGrid, IonCol,
    IonRow, IonToolbar, IonTitle, IonHeader, IonInput, IonButton, IonLabel, IonContent,
    CommonModule, FormsModule, NavbarComponent, IonSelect, IonSelectOption
  ]
})

export class RegistrarCiudadanoPage implements OnInit {
   ciudadano: any = null;
  // Variables de pareja
  nombresPareja = '';
  apellidoPaternoPareja = '';
  apellidoMaternoPareja = '';
  commentPareja = '';
  telefonoPareja = '';
  fechaNacimientoPareja = '';
  estadoCivilPareja = 1;

  hoy = '';
resetFormularioPrincipal() {
  this.nombres = '';
  this.apellidoPaterno = '';
  this.apellidoMaterno = '';
  this.comment = '';
  this.telefono = '';
  this.fechaNacimiento = '';
  this.estadoCivil = -1;
  this.parejaSeleccionada = null;
  this.busquedaPareja = '';
  this.ciudadanosFiltrados = [...this.personasDisponibles];
  this.mostrarBuscador = false;
}

  // Datos del ciudadano a registrar
  nombres = '';
  apellidoPaterno = '';
  apellidoMaterno = '';
  comment = '';
  telefono = '';
  fechaNacimiento = '';
  estadoCivil = -1;
  partner = null;

  parejaSeleccionada: any = null;  // 🔥 ¡CAMBIADO!
  ciudadanosDisponibles: any[] = [];
  personasDisponibles: any[] = []; // 🔥 ¡YA NO string[]!
  mostrarFormularioPareja = false;
  estadosConPareja = [2 /* 'Divorciado', 'Viudo' */];

  // Modal buscador de pareja
  modalAbierto = false;
  busquedaPareja = '';
  personasFiltradas: any[] = [];
  mostrarBuscador = false;
ciudadanos = [];

  mostrarBuscadorPareja = false;
searchTerm = '';
ciudadanosFiltrados = [...this.personasDisponibles];
estadoCivilParejaFijo: boolean = false;


  constructor(
     private toastController: ToastController,
    private location: Location,
    private ciudadanoService: CiudadanoService,
     private route: ActivatedRoute,
        private router: Router,
  ) {
    addIcons({ calendar });
  }

  ngOnInit() {
  const hoyLocal = new Date();
this.hoy = hoyLocal.toLocaleDateString('sv-SE'); // 'sv-SE' da formato 'YYYY-MM-DD'

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
    this.personasDisponibles = ciudadanos.filter(c => c.marital_status === 1);
    this.ciudadanosFiltrados = [...this.personasDisponibles]; // 🔥 aquí es el momento correcto
  });
}

formatearFecha(event: any) {
  if (typeof event === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(event)) {
    this.fechaNacimiento = event; // ✅ Ya viene bien del input
    return;
  }

  const date = new Date(event);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  this.fechaNacimiento = `${year}-${month}-${day}`; // ✅ Nada de UTC
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
    const basicValid =
      this.nombres.trim() !== ''

    if (this.estadosConPareja.includes(this.estadoCivil)) {
      return basicValid && this.parejaSeleccionada && this.parejaSeleccionada !== 'registrar';
    }

    return basicValid;
  }
ajustarFechaLocal(fecha: string | Date): string {
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    // Ya está bien formateada, no toques nada
    return fecha;
  }

  const date = new Date(fecha);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split('T')[0];
}

registrarCiudadano(): Promise<number> {
  return new Promise((resolve, reject) => {
    const dto = {
      name: this.nombres.trim(),
      last_name_father: this.apellidoPaterno.trim(),
      last_name_mother: this.apellidoMaterno.trim(),
      comment: this.comment.trim(),
      birth_date: this.fechaNacimiento.trim(),
      phone: this.telefono.trim(),
      marital_status: this.estadoCivil,
      partner: this.parejaSeleccionada?.id
    };

    this.ciudadanoService.crearCiudadano(dto).subscribe({
      next: async (res) => {
        const ciudadanoId = res.data?.id;
        if (ciudadanoId) {
          await this.mostrarToast('¡Ciudadano registrado con éxito!');
           this.router.navigate(['/buscar-ciudadano']);
          resolve(ciudadanoId);
        } else {
          await this.mostrarToastError('Error al registrar ciudadano');
          reject('Sin ID');
        }
      },
      error: async (err) => {
        console.error('Error al registrar ciudadano:', err);
        await this.mostrarToastError('Error al registrar ciudadano');
        reject(err);
      }
    });
  });
}


 async registrarPareja() {
  try {

    const dtoPareja = {
      name: this.nombresPareja.trim(),
      last_name_father: this.apellidoPaternoPareja.trim(),
      last_name_mother: this.apellidoMaternoPareja.trim(),
      comment: this.commentPareja.trim(),
      birth_date: this.fechaNacimientoPareja.trim(),
      phone: this.telefonoPareja.trim(),
      marital_status: 1,
      partner: null// 🔗 Enlaza al ciudadano
    };

    this.ciudadanoService.crearCiudadano(dtoPareja).subscribe({
      next: async (res) => {
        const parejaId = res.data?.id;

        if (!parejaId) {
          await this.mostrarToastError('Error al registrar pareja');
          return;
        }

    // Guardar la pareja seleccionada para el formulario principal
        this.parejaSeleccionada = { 
          id: parejaId,
          name: this.nombresPareja,
          last_name_father: this.apellidoPaternoPareja,
          last_name_mother: this.apellidoMaternoPareja
        };
        
        await this.mostrarToast('¡Pareja registrada! Ahora complete el formulario principal');
        this.cerrarFormularioPareja();
        this.cargarPersonasDisponibles();
      },
      error: async (err) => {
        console.error('Error al registrar pareja:', err);
        await this.mostrarToastError('Error al registrar pareja');
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
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
  if (persona === 'registrar') {
    this.estadoCivilPareja = 1;         // Prellenar
    this.estadoCivilParejaFijo = true;                 // Bloquear cambios
    this.mostrarFormularioPareja = true;               // Mostrar form
    this.cerrarBuscador();
  } else {
    this.parejaSeleccionada = persona;
    this.verificarSeleccion();
    this.cerrarBuscador();
  }
}


onSearchChange(event: any) {
  this.busquedaPareja = event.detail.value;
  this.filtrarPersonasDirecto(event);
}
// Método que recarga desde el backend
cargarCiudadano() {
  this.ciudadanoService.getCiudadanoPorId(this.ciudadano.id).subscribe((data) => {
    this.ciudadano = data;
  });
}

}
