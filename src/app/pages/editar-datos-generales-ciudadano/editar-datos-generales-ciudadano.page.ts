import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle,ToastController, IonToolbar, IonButton, IonRow, IonCol, IonLabel, IonGrid,
  IonSelectOption, IonIcon, IonSelect, IonCard, IonCardContent, IonInput, IonCardHeader, IonCardTitle
} from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-datos-generales-ciudadano',
  templateUrl: './editar-datos-generales-ciudadano.page.html',
  styleUrls: ['./editar-datos-generales-ciudadano.page.scss'],
  standalone: true,
  imports: [
    IonCardTitle, IonCardHeader, IonInput, IonCardContent, IonCard, IonIcon, IonGrid, IonLabel,
    IonCol, IonRow, IonButton, IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, NavbarComponent, FooterComponent, IonSelect, IonSelectOption
  ]
})
export class EditarDatosGeneralesCiudadanoPage implements OnInit {
  ciudadano: any = {
    name: '',
    last_name_father: '',
    last_name_mother: '',
    birth_date: '',
    phone: '',
    marital_status: '',
    partner: null
  };

  estadoCivil: string = '';
  parejaSeleccionada: any = null; // Cambiado a objeto
  personasDisponibles: any[] = [];
  mostrarFormularioPareja: boolean = false;

  estadosConPareja = ['Casado', 'Divorciado', 'Viudo'];

  constructor(
     private toastController: ToastController,
    private location: Location,
    private ciudadanoService: CiudadanoService,
    private route: ActivatedRoute
  ) {
    addIcons({ calendar });
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (!id) return;

    this.ciudadanoService.getCiudadanoPorId(id).subscribe(ciudadano => {
      this.ciudadano = ciudadano;
      this.estadoCivil = ciudadano.marital_status;
      this.parejaSeleccionada = ciudadano.partner;

      if (ciudadano.birth_date) {
        const fecha = new Date(ciudadano.birth_date);
        if (!isNaN(fecha.getTime())) {
          this.ciudadano.birth_date = fecha.toISOString().substring(0, 10);
        }
      }

      this.cargarPersonasDisponibles();
    });
  }

  volver() {
    this.location.back();
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

  cargarPersonasDisponibles() {
    this.ciudadanoService.getCiudadanos().subscribe(ciudadanos => {
      const parejaActual = this.ciudadano?.partner;

      this.personasDisponibles = ciudadanos.filter(c =>
        c.marital_status === 'Soltero' || (parejaActual && c.id === parejaActual.id)
      );

      // Asegura que la pareja actual esté en la lista
      if (parejaActual && !this.personasDisponibles.some(p => p.id === parejaActual.id)) {
        this.personasDisponibles.push(parejaActual);
      }
    });
  }

  onEstadoCivilChange() {
    if (!this.estadosConPareja.includes(this.estadoCivil)) {
      this.parejaSeleccionada = null;
      this.mostrarFormularioPareja = false;
    }
  }

  verificarSeleccion() {
    this.mostrarFormularioPareja = this.parejaSeleccionada === 'registrar';
  }

  filtrarTelefono(event: any) {
    const input = event.target as HTMLInputElement;
    const soloNumeros = input.value.replace(/\D/g, '').slice(0, 10);
    this.ciudadano.phone = soloNumeros;
    input.value = soloNumeros;
  }

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
    this.parejaSeleccionada = null;
  }

  actualizarCiudadano() {
    const id = this.ciudadano.id;

    const dto: any = {
      name: this.ciudadano.name,
      last_name_father: this.ciudadano.last_name_father,
      last_name_mother: this.ciudadano.last_name_mother,
      phone: this.ciudadano.phone,
      birth_date: this.ciudadano.birth_date,
      marital_status: this.estadoCivil,
      partner: null
    };

    if (this.parejaSeleccionada && this.parejaSeleccionada !== 'registrar') {
      dto.partner = this.parejaSeleccionada.id;
    }

    this.ciudadanoService.actualizarCiudadano(id, dto).subscribe({
      next: async () => {
        await this.mostrarToast('Datos actualizados correctamente')
        this.volver();
      },
      error: async (err) => {
        console.error('❌ Error al actualizar ciudadano:', err);
        await this.mostrarToastError('Ocurrio un error al actualizar')
      }
    });
  }



soloLetras(event: KeyboardEvent) {
  const tecla = event.key;
  const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;
  if (!patron.test(tecla)) {
    event.preventDefault();
    alert("No se aceptan numeros en este campo")
  }
}

soloNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permite solo dígitos (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      alert("No se permiten letras en este campo")
    }
  }

}
