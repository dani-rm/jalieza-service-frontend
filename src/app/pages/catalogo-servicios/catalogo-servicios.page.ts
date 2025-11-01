import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonToolbar, IonButton,
  IonCol, IonGrid, IonRow,IonIcon, IonCard,
  IonCardContent, IonText, IonSearchbar, 
  IonSelect, IonSelectOption, IonTitle, ToastController, AlertController
} from '@ionic/angular/standalone';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { CatalogoServiciosCrudService } from 'src/app/services/catalogo-servicios-crud.service';
import { ServicioCatalogo, Orden } from 'src/app/interfaces/catalogo-servicios.interface';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, refreshOutline, searchOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo-servicios',
  templateUrl: './catalogo-servicios.page.html',
  styleUrls: ['./catalogo-servicios.page.scss'],
  standalone: true,
  imports: [
    IonText, IonCardContent, IonCard, IonIcon,
    IonRow, IonGrid, IonCol, IonButton, IonContent,
    IonToolbar, IonTitle, CommonModule, FormsModule, NavbarComponent, 
    IonSearchbar, IonSelect, 
    IonSelectOption
  ]
})
export class CatalogoServiciosPage implements OnInit {

  // ✅ Variables de estado
  servicios: ServicioCatalogo[] = [];
  serviciosFiltrados: ServicioCatalogo[] = [];
  serviciosAgrupados: { [key: string]: ServicioCatalogo[] } = {};
  ordenes: Orden[] = [];
  
  // ✅ Variables de filtrado y búsqueda
  terminoBusqueda: string = '';
  ordenSeleccionada: string = 'TODAS';

  // ✅ Variables de UI
  cargando: boolean = false;
  error: string | null = null;

  constructor(
    private catalogoService: CatalogoServiciosCrudService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ addOutline, createOutline, trashOutline, refreshOutline, searchOutline });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  // Refresca la lista cada vez que se entra a la vista (no solo al cargar el componente)
  ionViewWillEnter() {
    this.cargarDatos();
  }

  // ✅ Cargar todos los datos necesarios
  async cargarDatos() {
    this.cargando = true;
    this.error = null;

    try {
      // Cargar servicios y órdenes en paralelo
      const [servicios, ordenes] = await Promise.all([
        this.catalogoService.getServicios().toPromise(),
        this.catalogoService.getOrdenes().toPromise()
      ]);

      this.servicios = servicios || [];
      this.ordenes = ordenes || [];
      
      this.aplicarFiltros();
      this.agruparServicios();
      
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      this.error = 'Error al cargar los datos';
      await this.mostrarToastError('Error al cargar los datos');
    } finally {
      this.cargando = false;
    }
  }

  // ✅ Aplicar filtros de búsqueda y orden
  aplicarFiltros() {
    let serviciosFiltrados = [...this.servicios];

    // Filtrar por término de búsqueda
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      serviciosFiltrados = serviciosFiltrados.filter(servicio =>
        servicio.service_name.toLowerCase().includes(termino) ||
        servicio.order.order_name.toLowerCase().includes(termino)
      );
    }

    // Filtrar por orden seleccionada
    if (this.ordenSeleccionada !== 'TODAS') {
      serviciosFiltrados = serviciosFiltrados.filter(servicio =>
        servicio.order.order_name === this.ordenSeleccionada
      );
    }

    // Filtrar solo servicios activos (no eliminados)
    serviciosFiltrados = serviciosFiltrados.filter(servicio =>
      servicio.deleted_at === null
    );

    this.serviciosFiltrados = serviciosFiltrados;
  }

  // ✅ Agrupar servicios por orden
  agruparServicios() {
    this.serviciosAgrupados = this.catalogoService.agruparServiciosPorOrden(this.serviciosFiltrados);
  }

  // ✅ Eventos de filtrado
  onBuscar(event: any) {
    this.terminoBusqueda = event.detail.value || '';
    this.aplicarFiltros();
    this.agruparServicios();
  }

  onOrdenCambiada(event: any) {
    this.ordenSeleccionada = event.detail.value;
    this.aplicarFiltros();
    this.agruparServicios();
  }


  // ✅ Navegación
  navegarACrearServicio() {
    this.router.navigate(['/catalogo-servicios/crear']);
  }

  navegarAEditarServicio(id: number) {
    this.router.navigate(['/catalogo-servicios/editar', id]);
  }

  // ✅ Acciones CRUD
  async confirmarEliminacion(servicio: ServicioCatalogo) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro que desea eliminar el servicio "${servicio.service_name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => this.eliminarServicio(servicio.id)
        }
      ]
    });

    await alert.present();
  }

  async eliminarServicio(id: number) {
    try {
      await this.catalogoService.eliminarServicio(id).toPromise();
      await this.mostrarToast('Servicio eliminado correctamente');
      this.cargarDatos(); // Recargar datos
    } catch (error) {
      console.error('❌ Error al eliminar servicio:', error);
      await this.mostrarToastError('Error al eliminar el servicio');
    }
  }


  // ✅ Utilidades
  obtenerNombresOrdenes(): string[] {
    return ['TODAS', ...this.ordenes.map(orden => orden.order_name)];
  }

  obtenerServiciosDeOrden(ordenNombre: string): ServicioCatalogo[] {
    return this.serviciosAgrupados[ordenNombre] || [];
  }

  obtenerNombresOrdenesAgrupadas(): string[] {
    return Object.keys(this.serviciosAgrupados);
  }


  // ✅ Toasts
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  async mostrarToastError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
    await toast.present();
  }
}
