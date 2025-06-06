import { Component, OnInit } from '@angular/core';
import { IonFooter,IonHeader, IonContent, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [IonToolbar, IonContent, IonFooter,IonHeader],
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
