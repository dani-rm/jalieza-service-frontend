import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonButtons, IonItem, IonLabel, IonInput, IonTextarea, IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';

@Component({
  selector: 'app-modal-finalizar-servicio',
  templateUrl: './modal-finalizar-servicio.component.html',
  styleUrls: ['./modal-finalizar-servicio.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonIcon
  ]
})
export class ModalFinalizarServicioComponent implements OnInit {
  @Input() nuevoEstado: string = '';
  @Input() fechaActual: string = '';
  @Input() observacionesActuales: string = '';

  end_date: string = '';
  observations: string = '';

  constructor(private modalController: ModalController) {
    addIcons({ calendar });
  }

  ngOnInit() {
    this.end_date = this.fechaActual || new Date().toISOString().split('T')[0];
    this.observations = this.observacionesActuales || '';
  }

  abrirSelectorFecha(fechaInput: any) {
    const nativeInput = fechaInput?.getInputElement?.();
    if (nativeInput instanceof Promise) {
      nativeInput.then((input: any) => input?.showPicker?.() || input?.focus());
    } else {
      nativeInput?.showPicker?.() || nativeInput?.focus();
    }
  }

  cancelar() {
    this.modalController.dismiss(null, 'cancel');
  }

  confirmar() {
    if (!this.end_date) {
      return;
    }

    this.modalController.dismiss(
      {
        end_date: this.end_date,
        observations: this.observations
      },
      'confirm'
    );
  }
}
