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
    private navCtrl: NavController,
    private ciudadanoService: CiudadanoService,
    private menuCtrl: MenuController
  ) {}

  searchTerm = '';
  selectedFilter = 'todos';
  selectedCargo = 'todos';
  selectedCandidatoCargo = 'todos';

  ciudadanos: any[] = [];
  ciudadanosFiltrados: any[] = [];

  ngOnInit() {
    this.menuCtrl.enable(true);

    this.ciudadanoService.getCiudadanos().subscribe({
      next: (data) => {
        this.ciudadanos = data;
        this.filtrarCiudadanos();
      },
      error: (err) => {
        console.error('Error al obtener ciudadanos:', err);
      }
    });

    /*
    if (!sessionStorage.getItem('recargado')) {
      sessionStorage.setItem('recargado', 'true');
      location.reload(); // ⚠️ recarga completa
    } else {
      sessionStorage.removeItem('recargado');
    }
    */
  }

  filtrarCiudadanos() {
    if (!this.searchTerm.trim()) {
  this.ciudadanosFiltrados = this.ciudadanos;
  return;
}
    this.ciudadanosFiltrados = this.ciudadanos.filter(ciudadano => {
      const search = this.searchTerm.toLowerCase();
      const matchBusqueda =
        ciudadano.nombres?.toLowerCase().includes(search) ||
        ciudadano.apellidoPaterno?.toLowerCase().includes(search) ||
        ciudadano.apellidoMaterno?.toLowerCase().includes(search);

      const visible = ciudadano.visible;

      let coincideFiltro = false;

      switch (this.selectedFilter) {
        case 'todos':
          coincideFiltro = true;
          break;
        case 'activo':
          coincideFiltro = visible;
          break;
        case 'inactivo':
          coincideFiltro = !visible;
          break;
        case 'casado':
          coincideFiltro = ciudadano.estadoCivil === 'Casado' && visible;
          break;
        case 'soltero':
          coincideFiltro = ciudadano.estadoCivil === 'Soltero' && visible;
          break;
        case 'divorciado':
          coincideFiltro = ciudadano.estadoCivil === 'Divorciado' && visible;
          break;
        case 'viudo':
          coincideFiltro = ciudadano.estadoCivil === 'Viudo' && visible;
          break;
        case 'conCargos':
          coincideFiltro =
            visible &&
            (this.selectedCargo === 'todos'
              ? !!ciudadano.cargo
              : ciudadano.cargo === this.selectedCargo);
          break;
        case 'sinCargos':
          coincideFiltro = !ciudadano.cargo && visible;
          break;
        case 'candidato':
          coincideFiltro =
            visible &&
            (this.selectedCandidatoCargo === 'todos'
              ? !!ciudadano.candidatoACargo
              : ciudadano.candidatoACargo === this.selectedCandidatoCargo);
          break;
      }

      return matchBusqueda && coincideFiltro;
    });
  }

  verCiudadano(ciudadano: any) {
    this.ciudadanoService.setCiudadano(ciudadano);
    this.navCtrl.navigateForward('/ciudadano');
  }
}
