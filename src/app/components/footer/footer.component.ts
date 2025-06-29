import { Component, OnInit } from '@angular/core';
import { IonFooter, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [IonToolbar, IonFooter],
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
