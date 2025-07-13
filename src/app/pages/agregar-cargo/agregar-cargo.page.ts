import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonItem, IonGrid, IonLabel,
  IonButton, IonSelect, IonSelectOption, IonInput, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HttpClient } from '@angular/common/http';

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
  ciudadanoId: number=1;

  service_id: number | null = null;
  start_date: string = '';
  end_date: string = '';
  termination_status: string = 'completado';
  observations: string = '';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    addIcons({ calendar });
  }

  ngOnInit() {
    // Obtener id del ciudadano de la ruta
    this.ciudadanoId = +this.route.snapshot.paramMap.get('id')!;
  }

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

  registrarCargo() {
    if (!this.service_id || !this.start_date || !this.end_date || !this.termination_status) {
      console.error('❌ Faltan campos obligatorios');
      return;
    }

    const body = {
      ciudadano_id: this.ciudadanoId,  // Ojo: tu backend usa ciudadano_id, no citizen_id
      service_id: this.service_id,
      start_date: this.start_date,
      end_date: this.end_date,
      termination_status: this.termination_status,
      observations: this.observations || ''
    };

    this.http.post('http://localhost:3000/api/v1/servicios-ciudadanos', body).subscribe({
      next: () => {
        console.log('✅ Cargo registrado');
        this.volver();
      },
      error: err => {
        console.error('❌ Error al registrar cargo:', err);
      }
    });
  }
}
