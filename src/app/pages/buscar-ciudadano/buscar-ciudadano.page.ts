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
  let filtrados = [...this.ciudadanos];

  switch(this.selectedFilter) {
    case 'todos':
      // No filtramos, dejamos todos
      break;
    case 'activo':
      filtrados = filtrados.filter(c => !c.deleted_at); // deleted_at nulo = activo
      break;
    case 'inactivo':
      filtrados = filtrados.filter(c => !!c.deleted_at); // deleted_at no nulo = inactivo
      break;
    case 'soltero':
      filtrados = filtrados.filter(c => c.marital_status === 'Soltero');
      break;
    case 'casado':
      filtrados = filtrados.filter(c => c.marital_status === 'Casado');
      break;
    case 'divorciado':
      filtrados = filtrados.filter(c => c.marital_status === 'Divorciado');
      break;
    case 'viudo':
      filtrados = filtrados.filter(c => c.marital_status === 'Viudo');
      break;
    case 'conCargos':
      filtrados = filtrados.filter(ciudadano =>
        ciudadano.services?.some((serv:any) =>
          serv.termination_status === 'en_curso' &&
          (this.selectedCargo === 'todos' || serv.service_name === this.selectedCargo)
        )
      );
      break;
    case 'sinCargos':
      filtrados = filtrados.filter(ciudadano =>
        !ciudadano.services || ciudadano.services.length === 0
      );
      break;
case 'candidato':
  filtrados = filtrados.filter(ciudadano =>
    this.estaPorTerminarDescanso(ciudadano)
  );
  break;

    default:
      break;
  }

  // Filtro de búsqueda
  if (this.searchTerm && this.searchTerm.trim() !== '') {
    const term = this.searchTerm.toLowerCase();
    filtrados = filtrados.filter(c =>
      (c.name?.toLowerCase().includes(term) ||
       c.last_name_father?.toLowerCase().includes(term) ||
       c.last_name_mother?.toLowerCase().includes(term))
    );
  }

  this.ciudadanosFiltrados = filtrados;
}
normalizarOrden(orden: string): string | null {
  const limpio = orden.trim().toLowerCase();
  switch (limpio) {
    case 'primer':
    case '1er':
    case '1':
    case 'primer nivel':
      return 'Primer';
    case 'segundo':
    case '2do':
    case '2':
    case 'segundo nivel':
      return 'Segundo';
    case 'tercer':
    case '3ro':
    case '3':
    case 'tercer nivel':
      return 'Tercer';
    case 'cuarto':
    case '4to':
    case '4':
    case 'cuarto nivel':
      return 'Cuarto';
    case 'quinto':
    case '5to':
    case '5':
    case 'quinto nivel':
      return 'Quinto';
    case 'sexto':
    case '6to':
    case '6':
    case 'sexto nivel':
      return 'Sexto';
    default:
      return null;
  }
}

calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
estaPorTerminarDescanso(ciudadano: any): boolean {
  // Filtramos los servicios completados
  const completados = ciudadano.services?.filter((s: any) => s.termination_status === 'completado');
  if (!completados || completados.length === 0) return false;

  // Tomamos el último servicio completado
  const ultimoServicio = completados.reduce((másReciente: any, actual: any) => {
    return new Date(actual.end_date) > new Date(másReciente.end_date) ? actual : másReciente;
  });

  const fechaInicio = new Date(ultimoServicio.start_date);
  const fechaFin = new Date(ultimoServicio.end_date);

  // Duración del servicio
  const duracionMS = fechaFin.getTime() - fechaInicio.getTime();

  // Fecha en que termina el descanso
  const descansoFin = new Date(fechaFin.getTime() + duracionMS);

  // Fecha actual + 3 meses
  const hoy = new Date();
  const tresMesesDespues = new Date(hoy);
  tresMesesDespues.setMonth(hoy.getMonth() + 3);

  // Si ya falta menos de 3 meses para terminar el descanso
  return descansoFin <= tresMesesDespues && descansoFin > hoy;
}

verCiudadano(id: number) {
  this.navCtrl.navigateForward(`/ciudadano/${id}`);
}

}
