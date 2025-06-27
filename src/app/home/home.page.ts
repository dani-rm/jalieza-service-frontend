import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonGrid, IonRow, IonCol,
  IonSearchbar, IonItem, IonAvatar, IonLabel, IonText, IonInput, IonButton, IonIcon,} from '@ionic/angular/standalone';
import { NavbarComponent } from './../components/navbar/navbar.component'
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonIcon, IonButton, IonInput, IonText, IonLabel, IonAvatar, IonItem, IonSearchbar, IonCol,
    IonRow, IonGrid, CommonModule, IonCardContent, IonCard, IonContent,NavbarComponent,FooterComponent,
    IonHeader, IonToolbar, IonTitle, FormsModule],
})
export class HomePage {
  constructor(public router: Router) {
    addIcons({
    'eye': eye,
    'eye-off': eyeOff
  });
  }
  showPassword = false;
  password = '';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
