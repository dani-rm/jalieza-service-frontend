import { Component } from '@angular/core';
import {
  IonApp, IonMenu, IonRouterOutlet, IonContent, IonList, IonItem, IonLabel
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // ajusta el path si es necesario
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonLabel,CommonModule, IonMenu, IonItem, IonList, IonContent, IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}
