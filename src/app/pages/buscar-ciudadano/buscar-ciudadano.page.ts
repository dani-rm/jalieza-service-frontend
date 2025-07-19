import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonTitle,
  IonCard,
  IonSearchbar,
  IonCardContent,
  IonAvatar,
  IonItem,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component';
import { FooterComponent } from './../../components/footer/footer.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { CatalogoServiciosService } from 'src/app/services/catalogo-servicios.service';

@Component({
  selector: 'app-buscar-ciudadano',
  templateUrl: './buscar-ciudadano.page.html',
  styleUrls: ['./buscar-ciudadano.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonAvatar,
    IonCardContent,
    IonSearchbar,
    IonCard,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonLabel,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ]
})
export class BuscarCiudadanoPage implements OnInit {

  constructor(
      private catalogoServiciosService: CatalogoServiciosService ,
    private navCtrl: NavController,
    private ciudadanoService: CiudadanoService,
    private menuCtrl: MenuController
  ) {}

  cargos: any[] = [];
  searchTerm = '';
  selectedFilter = 'todos';
  selectedCargo = 'todos';
  selectedCandidatoCargo = 'todos';

  ciudadanos: any[] = [];
  ciudadanosFiltrados: any[] = [];

  ngOnInit() {
    console.log(this.ciudadanos)
    this.menuCtrl.enable(true);
     this.obtenerCargos(); // 👈s

    this.ciudadanoService.getCiudadanos().subscribe({
      next: (data) => {
         console.log('📦 Ciudadanos recibidos:', data);
        this.ciudadanos = data;
console.log('👁 Ciudadanos con posibles cargos:', this.ciudadanos.map(c => ({ id: c.id, services: c.services })));

        this.filtrarCiudadanos();
      },
      error: (err) => {
        console.error('Error al obtener ciudadanos:', err);
      }
    });
  }
 obtenerCargos() {
  this.catalogoServiciosService.getCatalogoServicios().subscribe({
    next: (data) => {
      this.cargos = data;
      console.log('🎯 Catálogo de cargos recibido:', data);
    },
    error: (err) => {
      console.error('Error al obtener catálogo de cargos:', err);
    }
  });
}

filtrarCiudadanos() {
  if (this.selectedFilter === 'todos') {
    this.ciudadanosFiltrados = [...this.ciudadanos];
  } else if (this.selectedFilter === 'sinCargos') {
    this.ciudadanosFiltrados = this.ciudadanos.filter(ciudadano =>
      !ciudadano.services || ciudadano.services.length === 0
    );
  } else if (this.selectedFilter === 'conCargos') {
    this.ciudadanosFiltrados = this.ciudadanos.filter(ciudadano =>
      ciudadano.services?.some((serv:any) =>
        serv.termination_status === 'en_curso' &&
        (this.selectedCargo === 'todos' || serv.service_name === this.selectedCargo)
      )
    );
  }
}


verCiudadano(id: number) {
  this.navCtrl.navigateForward(`/ciudadano/${id}`);
}

}
