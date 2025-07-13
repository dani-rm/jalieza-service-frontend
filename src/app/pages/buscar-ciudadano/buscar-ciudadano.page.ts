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
    console.log(this.ciudadanos)
    this.menuCtrl.enable(true);

    this.ciudadanoService.getCiudadanos().subscribe({
      next: (data) => {
         console.log('📦 Ciudadanos recibidos:', data);
        this.ciudadanos = data;
        this.filtrarCiudadanos();
      },
      error: (err) => {
        console.error('Error al obtener ciudadanos:', err);
      }
    });
  }

  filtrarCiudadanos() {
    const search = this.searchTerm.trim().toLowerCase();

    this.ciudadanosFiltrados = this.ciudadanos.filter(ciudadano => {
      const visible = ciudadano.visible;

      const nombreCompleto = `${ciudadano.name} ${ciudadano.last_name_father} ${ciudadano.last_name_mother}`.toLowerCase();
      const coincideBusqueda = nombreCompleto.includes(search);

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
          coincideFiltro = ciudadano.marital_status === 'Casado' && visible;
          break;
        case 'soltero':
          coincideFiltro = ciudadano.marital_status === 'Soltero' && visible;
          break;
        case 'divorciado':
          coincideFiltro = ciudadano.marital_status === 'Divorciado' && visible;
          break;
        case 'viudo':
          coincideFiltro = ciudadano.marital_status === 'Viudo' && visible;
          break;
        case 'conCargos':
          coincideFiltro =
            visible &&
            (this.selectedCargo === 'todos'
              ? !!ciudadano.cargo
              : ciudadano.cargo === this.selectedCargo);
          break;
        case 'sinCargos':
          coincideFiltro = visible && !ciudadano.cargo;
          break;
        case 'candidato':
          coincideFiltro =
            visible &&
            (this.selectedCandidatoCargo === 'todos'
              ? !!ciudadano.candidatoACargo
              : ciudadano.candidatoACargo === this.selectedCandidatoCargo);
          break;
        default:
          coincideFiltro = true;
          break;
      }

      return coincideBusqueda && coincideFiltro;
    });
  }

verCiudadano(id: number) {
  this.navCtrl.navigateForward(`/ciudadano/${id}`);
}

}
