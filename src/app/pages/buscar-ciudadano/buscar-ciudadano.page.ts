import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonLabel, IonTitle, IonSearchbar, IonItem, IonButton, IonSelect, IonSelectOption, IonToolbar, IonHeader } from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component';
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
    IonSearchbar,
    IonButton,
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
    IonToolbar,
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

  // Mapear estado civil para mostrar en pantalla
  mostrarEstadoCivil(ciudadano: any): string {
    const valor = ciudadano?.marital_status;
    // Si viene como número o string numérico
    if (valor === 1 || valor === '1') return 'Soltero';
    if (valor === 2 || valor === '2') return 'Casado';
    // Si ya viene como texto desde el backend, lo normalizamos un poco
    if (typeof valor === 'string') {
      const v = valor.toLowerCase();
      if (v.includes('solter')) return 'Soltero';
      if (v.includes('casad')) return 'Casado';
    }
    return valor || '-';
  }

  ngOnInit() {
    console.log('Ciudadanos cargados:', this.ciudadanos);
    console.log(this.ciudadanos);
    this.menuCtrl.enable(true);
    this.obtenerCargos(); // Cargar catálogo de cargos
    this.cargarCiudadanos(); // Primera carga
  }

  // Ionic vuelve a montar esta vista desde caché y ngOnInit no se ejecuta de nuevo.
  // ionViewWillEnter se dispara cada vez que la página entra en foco.
  ionViewWillEnter() {
    this.cargarCiudadanos(); // Refrescar lista al regresar desde registrar-ciudadano
  }

  private cargarCiudadanos() {
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

  // Aplicar filtro principal
  switch (this.selectedFilter) {
    case 'todos':
      // Mostrar todos los ciudadanos activos, sin filtrar por estado civil o cargos
      filtrados = filtrados.filter(c => !c.deleted_at);
      break;
    case 'activo':
      filtrados = filtrados.filter(c => !c.deleted_at);
      break;
    case 'inactivo':
      filtrados = filtrados.filter(c => !!c.deleted_at);
      break;
    case 'soltero':
      filtrados = filtrados.filter(c =>
        !c.deleted_at && (c.marital_status === 1 || c.marital_status === '1' ||
        (typeof c.marital_status === 'string' && c.marital_status.toLowerCase().includes('solter')))
      );
      break;
    case 'casado':
      filtrados = filtrados.filter(c =>
        !c.deleted_at && (c.marital_status === 2 || c.marital_status === '2' ||
        (typeof c.marital_status === 'string' && c.marital_status.toLowerCase().includes('casad')))
      );
      break;
    case 'divorciado':
      filtrados = filtrados.filter(c => c.marital_status === 'Divorciado' && !c.deleted_at);
      break;
    case 'viudo':
      filtrados = filtrados.filter(c => c.marital_status === 'Viudo' && !c.deleted_at);
      break;
    case 'conCargos':
      filtrados = filtrados.filter(c =>
        !c.deleted_at &&
        c.services?.some((serv: any) =>
          serv.termination_status === 'en_curso' &&
          (this.selectedCargo === 'todos' || serv.service_name === this.selectedCargo)
        )
      );
      break;
    case 'sinCargos':
      filtrados = filtrados.filter(c =>
        !c.deleted_at &&
        (!c.services || c.services.length === 0)
      );
      break;
   case 'candidato':
  console.log('📢 Entrando a filtro CANDIDATO...');
  filtrados = filtrados.filter(c => {
    const resultado = !c.deleted_at && this.estaPorTerminarDescanso(c);
    console.log(`🔍 ${c.name} → Pasa: ${resultado}`);
    return resultado;
  });
  break;
case 'conComentario':
  filtrados = filtrados.filter(c =>
    !c.deleted_at &&
    c.comment && c.comment.trim() !== ''
  );
  break;

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
  const completados = ciudadano.services?.filter(
    (s: any) => s.termination_status === 'completado'
  );
  if (!completados || completados.length === 0) return false;

  // Tomamos el último servicio completado
  const ultimoServicio = completados.reduce((másReciente: any, actual: any) => {
    return new Date(actual.end_date) > new Date(másReciente.end_date) ? actual : másReciente;
  });

  const fechaInicio = new Date(ultimoServicio.start_date);
  const fechaFin = new Date(ultimoServicio.end_date);

  // Duración del servicio (en milisegundos)
  const duracion = fechaFin.getTime() - fechaInicio.getTime();

  // Descanso termina cuando se cumple la misma duración después de end_date
  const descansoFin = new Date(fechaFin.getTime() + duracion);

  const hoy = new Date('05-08-2025');

  // Calcular si falta menos de 3 meses para que termine el descanso
  const tresMesesAntesDeDescansoFin = new Date(descansoFin);
  tresMesesAntesDeDescansoFin.setMonth(descansoFin.getMonth() - 3);

  console.log(`🧮 ${ciudadano.name} →
  Último servicio: ${fechaInicio.toDateString()} a ${fechaFin.toDateString()},
  Descanso termina: ${descansoFin.toDateString()},
  Hoy: ${hoy.toDateString()},
  En ventana de 3 meses: ${hoy >= tresMesesAntesDeDescansoFin && hoy < descansoFin}
`);

  // Si ya estamos en los 3 meses finales antes de que termine el descanso
  return hoy >= tresMesesAntesDeDescansoFin && hoy < descansoFin;
}



verCiudadano(id: number) {
  this.navCtrl.navigateForward(`/ciudadano/${id}`);
}

}
