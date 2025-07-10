import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonGrid, IonRow, IonCol, IonLabel,
  IonIcon, IonItem, IonSelect, IonInput, IonSelectOption } from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { Location } from '@angular/common';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';

@Component({
  selector: 'app-editar-cargos-ciudadano',
  templateUrl: './editar-cargos-ciudadano.page.html',
  styleUrls: ['./editar-cargos-ciudadano.page.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonIcon, IonLabel, IonCol, IonRow, IonGrid, IonButton, IonContent, IonHeader,
    IonTitle, IonToolbar, IonSelectOption, CommonModule, FormsModule, NavbarComponent, FormsModule, IonSelect,
    ReactiveFormsModule, FooterComponent]
})
export class EditarCargosCiudadanoPage implements OnInit {
  constructor(private location: Location) {
    addIcons({calendar});
  }

  ngOnInit() {
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

}
