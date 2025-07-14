import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonRow, IonCol, IonLabel, IonGrid,
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
      next: () => {
        alert('✅ Datos actualizados correctamente');
        this.volver();
      },
      error: (err) => {
        console.error('❌ Error al actualizar ciudadano:', err);
        alert('❌ Ocurrió un error al actualizar');
      }
    });
  }
}
