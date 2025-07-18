import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonGrid, IonRow, IonCol, IonLabel, IonInput, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { NavbarComponent } from './../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eye, eyeOff } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonIcon, IonButton, IonInput, IonLabel, IonCol, IonRow, IonGrid,
    CommonModule, IonContent, NavbarComponent, FooterComponent, FormsModule
  ],
})
export class HomePage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    public router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private menuCtrl: MenuController,
      private authService: AuthService
  ) {
    addIcons({ eye, eyeOff });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false); // Desactiva el menú en pantalla de login
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

 login() {
  const body = { email: this.email, password: this.password };

  this.http.post<{token: string}>('http://localhost:3000/api/v1/auth/login', body, {
    withCredentials: true,
  }).subscribe({
    next: (response) => {
      console.log('Token recibido:', response.token);

      console.log('✅ Login exitoso',this.email);
      this.authService.guardarSesion(response.token);
      this.router.navigate(['/buscar-ciudadano']);
    },
    error: async (err) => {
      console.error('❌ Error en login', err);
      const alert = await this.alertController.create({
        header: 'Error',
        message: err?.error?.message || 'No se pudo iniciar sesión',
        buttons: ['OK'],
      });
      await alert.present();
    }
  });
}
}
