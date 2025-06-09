import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { NavbarComponent } from './../components/navbar/navbar.component'
import { FooterComponent } from '../components/footer/footer.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent,NavbarComponent,FooterComponent],
})
export class HomePage {
  constructor() {}
}
