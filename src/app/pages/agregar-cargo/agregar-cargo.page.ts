import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonItem, IonGrid, IonLabel,
  IonButton, IonSelect, IonSelectOption, IonInput, IonIcon, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HttpClient } from '@angular/common/http';
interface CatalogoOrden {
  id: number;
  order_name: string;
  required_points: number;
  services: ServicioOrden[]; // 👈 este campo lo causaba el error
}

interface ServicioOrden {
  id: number;
  service_name: string; // o 'titulo' o como venga el campo del servicio en tu JSON
}
@Component({
  selector: 'app-agregar-cargo',
  templateUrl: './agregar-cargo.page.html',
  styleUrls: ['./agregar-cargo.page.scss'],
  standalone: true,
  imports: [
    IonIcon, IonInput, IonButton, IonLabel, IonGrid, IonItem, IonRow, IonCol,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    NavbarComponent, IonSelect, IonSelectOption, FooterComponent
  ]
})
export class AgregarCargoPage implements OnInit {
  ciudadanoId: number = 1;
  serviciosDelOrden:ServicioOrden[] = [];
ordenSeleccionadoId: number | null = null;

  service_id: number | null = null;
  start_date: string = '';
  end_date: string = '';
 termination_status: 'completado' | 'en_curso' | 'inconcluso' = 'completado';

  observations: string = '';
  ordenes: CatalogoOrden[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastController: ToastController
  ) {
    addIcons({ calendar });
  }

  ngOnInit() {
    // Obtener id del ciudadano de la ruta
    this.ciudadanoId = +this.route.snapshot.paramMap.get('id')!;
      this.cargarOrdenes();

  }
  onOrdenSeleccionado() {
  const orden = this.ordenes.find(o => o.id === this.ordenSeleccionadoId);
  this.serviciosDelOrden = orden?.services || [];
  this.service_id = null; // Reinicia el servicio seleccionado
  console.log('🔍 Orden seleccionada:', orden);
  console.log('🛠 Servicios disponibles:', orden?.services);
}
  cargarOrdenes() {
  this.http.get<CatalogoOrden[]>('http://localhost:3000/api/v1/catalogo-orden')
    .subscribe({
      next: data => {
        this.ordenes = data;
        console.log('📦 Órdenes recibidas:', data);

      },
      error: err => {
        console.error('❌ Error al obtener órdenes:', err);
      }
    });}

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


  registrarCargo() {
    if (!this.service_id || !this.start_date || !this.end_date || !this.termination_status) {
      console.error('❌ Faltan campos obligatorios');
      return;
    }

    const body = {
      ciudadano_id: this.ciudadanoId,
      service_id: this.service_id,
      start_date: this.start_date,
      end_date: this.end_date,
      termination_status: this.termination_status,
      observations: this.observations || ''
    };
      console.log('Payload a enviar:', body);

    this.http.post('http://localhost:3000/api/v1/servicios-ciudadanos', body).subscribe({
      next: async () => {
        console.log('✅ Cargo registrado');
        await this.mostrarToast('Cargo registrado correctamente');

        // Marca para refrescar la vista anterior
        localStorage.setItem('cargoActualizado', 'true');
        this.volver();
      },
      error: async err => {
        console.error('❌ Error al registrar cargo:', err);
        await this.mostrarToastError('Error al registrar cargo')
      }
    });
  }
}
