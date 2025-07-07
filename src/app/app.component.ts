import { Component } from '@angular/core';
import { IonApp,IonMenu, IonRouterOutlet, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
   styleUrls: ['app.component.scss'],
  imports: [IonLabel,IonMenu, IonItem, IonList, IonContent, IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
