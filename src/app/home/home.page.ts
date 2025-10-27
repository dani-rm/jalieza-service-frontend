import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonGrid, IonRow, IonCol, IonLabel, IonInput, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { HttpClient } from '@angular/common/http';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonIcon, IonButton, IonInput, IonLabel, IonCol, IonRow, IonGrid,
    CommonModule, IonContent, FormsModule
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
    addIcons({ eyeOutline, eyeOffOutline });
  }

  ionViewWillEnter() {
    // Desactiva el menú en pantalla de login
    this.menuCtrl.enable(false);

    // Si ya está autenticado, evita volver a ver el login usando el botón atrás
    if (this.authService.isAuthenticated && typeof this.authService.isAuthenticated === 'function') {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/buscar-ciudadano'], { replaceUrl: true });
        return;
      }
    }

    // Limpia los campos cada vez que se entra al login (evita valores previos)
    this.email = '';
    this.password = '';
    this.showPassword = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

 login() {
  const body = { email: this.email, password: this.password };
  const url = `${environment.apiUrl}/auth/login`;

  this.http.post<{token: string}>(url, body, {
    withCredentials: true,
  }).subscribe({
    next: (response) => {
      console.log('Token recibido:', response.token);
      console.log('✅ Login exitoso', this.email);
      this.authService.guardarSesion(response.token);
  this.router.navigate(['/buscar-ciudadano'], { replaceUrl: true });
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
