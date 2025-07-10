import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonItem, IonGrid, IonLabel,
  IonButton, IonSelect, IonSelectOption, IonInput, IonIcon } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-agregar-cargo',
  templateUrl: './agregar-cargo.page.html',
  styleUrls: ['./agregar-cargo.page.scss'],
  standalone: true,
  imports: [IonIcon, IonInput, IonButton, IonLabel, IonGrid, IonItem, IonRow, IonCol, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule, NavbarComponent, IonSelect, IonSelectOption, FooterComponent]
})
export class AgregarCargoPage implements OnInit {
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
