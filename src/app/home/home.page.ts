import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonGrid, IonRow, IonCol, IonLabel, IonInput, IonButton, IonIcon,} from '@ionic/angular/standalone';
import { NavbarComponent } from './../components/navbar/navbar.component'
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonIcon, IonButton, IonInput, IonLabel, IonCol, IonRow, IonGrid, CommonModule, IonContent,
    NavbarComponent, FooterComponent, FormsModule],
})
export class HomePage {
  constructor(public router: Router) {
    addIcons({eye, eyeOff});
  }

  showPassword = false;
  password = '';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
