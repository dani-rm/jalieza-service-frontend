import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonGrid, IonRow, IonCol, IonLabel, IonInput, IonButton, IonIcon,} from '@ionic/angular/standalone';
import { NavbarComponent } from './../components/navbar/navbar.component'
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';

import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonIcon, IonButton, IonInput, IonLabel, IonCol, IonRow, IonGrid, CommonModule, IonContent,
    NavbarComponent, FooterComponent, FormsModule],
})
export class HomePage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  constructor(public router: Router,
      private http: HttpClient,
    private alertController: AlertController,
  ) {
    addIcons({eye, eyeOff});

  }

  /*showPassword = false;
  password = '';*/

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
    login() {
    const body = {
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:3000/api/v1/auth/login', body).subscribe({
      next: (response: any) => {
        console.log('Login exitoso:', response);
        localStorage.setItem('token', response.token); // Guarda token si quieres
        // Puedes redirigir o mostrar mensaje
      },
      error: async (err) => {
        console.error('Error en login', err);
        const alert = await this.alertController.create({
          header: 'Error',
          message: err?.error?.message || 'No se pudo iniciar sesión',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

}
