import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonLabel, IonTitle, IonSearchbar, IonItem, IonButton, IonSelect, IonSelectOption, IonToolbar, IonHeader } from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component';
import { CiudadanoService } from 'src/app/services/ciudadano.service';
import { NavController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { CatalogoServiciosService } from 'src/app/services/catalogo-servicios.service';
  import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addIcons } from 'ionicons';
import { addCircleOutline, menuOutline, checkmarkCircleOutline, cloudDownloadOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/angular/standalone';



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
    IonIcon
  ]
})
export class BuscarCiudadanoPage implements OnInit {

  constructor(
    private catalogoServiciosService: CatalogoServiciosService,
    private navCtrl: NavController,
    private ciudadanoService: CiudadanoService,
    private menuCtrl: MenuController
 ) {
    addIcons({ menuOutline, addCircleOutline, checkmarkCircleOutline, cloudDownloadOutline });
  }
  

  cargos: any[] = [];
  searchTerm = '';
  selectedFilter = 'todos';
  selectedCargo = 'todos';
  selectedCandidatoCargo = 'todos';

  // ciudadanos: any[] = [];
  ciudadanosOriginal: any[] = [];
  ciudadanosFiltrados: any[] = [];

  ciudadanosPorPagina = 20;
  paginaActual = 1;

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
    console.log('Ciudadanos cargados:', this.ciudadanosOriginal);
    console.log(this.ciudadanosOriginal);
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
        //this.ciudadanos = data;
        this.ciudadanosOriginal = data; // Guarda los datos de los ciudadanos originales
        console.log('👁 Ciudadanos con posibles cargos:', this.ciudadanosOriginal.map(c => ({ id: c.id, services: c.services })));
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

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
    this.actualizarCiudadanosPaginados();
  }

  actualizarCiudadanosPaginados() {
    const inicio = (this.paginaActual - 1) * this.ciudadanosPorPagina;
    const fin = inicio + this.ciudadanosPorPagina;
    this.ciudadanosFiltrados = this.ciudadanosFiltrados.slice(inicio, fin);
  }

  filtrarCiudadanos() {
    let filtrados = [...this.ciudadanosOriginal];

    // Aplicar filtro principal
    switch (this.selectedFilter) {
      case 'todos':
        // Mostrar todos los ciudadanos activos, sin filtrar por estado civil o cargos
        filtrados = this.ciudadanosOriginal.filter(c => !c.deleted_at);
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
      case 'conCargosRechazados':
        filtrados = filtrados.filter(c =>
          !c.deleted_at &&
          c.services?.some((serv: any) =>
            serv.service_status === 'rechazado'
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
      //const term = this.searchTerm.toLowerCase();
      const term = this.normalizarTexto(this.searchTerm);
      if (term) {
        filtrados = filtrados.filter(c => {
          const nombreCompleto = this.normalizarTexto(
            `${c.name || ''} ${c.last_name_father || ''} ${c.last_name_mother || ''}`
          );

          return nombreCompleto.includes(term);
        });
      }
    }

    this.ciudadanosFiltrados = filtrados;
    this.actualizarCiudadanosPaginados();
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

  normalizarTexto(texto: string): string {
    return texto
      ?.toLowerCase()
      .normalize('NFD') // separa acentos
      .replace(/[\u0300-\u036f]/g, '') // elimina acentos
      .replace(/\s+/g, ' ') // múltiples espacios → uno
      .trim(); // quita espacios inicio/fin
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
  get totalPaginas(): number {
    return Math.ceil(this.ciudadanosFiltrados.length / this.ciudadanosPorPagina);
  }


   async generarPDFCiudadanos() {
    const doc = new jsPDF();

    if (!this.ciudadanosOriginal || this.ciudadanosOriginal.length === 0) {
      console.warn('No hay ciudadanos para exportar');
      return;
    }

    try {
      // ✅ LOGO
      const logo = await this.getBase64ImageFromURL('assets/LogoJaliezaNavbar_2026.jpeg');

      const pageWidth = doc.internal.pageSize.getWidth();

      // 🔥 Logo a la derecha y un poco arriba
      doc.addImage(logo, 'JPEG', pageWidth - 30, 5, 20, 20);

    } catch (error) {
      console.error('Error cargando imagen:', error);
    }

    // ✅ TÍTULO
    doc.setFontSize(18);
    doc.text('Listado de Ciudadanos', 14, 15);

    // ✅ Línea (color guinda)
    doc.setDrawColor(122, 28, 28);
    doc.setLineWidth(0.5);
    doc.line(14, 20, 165, 20);

    // ✅ Datos
    const body = this.ciudadanosOriginal.map((c, index) => [
      index + 1,
      `${c.name} ${c.last_name_father} ${c.last_name_mother}`,
      c.phone || '-',
      this.mostrarEstadoCivil(c),
      c.address || '-'
    ]);

    // ✅ Tabla
    autoTable(doc, {
      startY: 30,
      theme: 'grid',
      head: [['#', 'Nombre Completo', 'Teléfono', 'Estado Civil', 'Dirección']],
      body: body,
      styles: {
        fontSize: 9
      },
      headStyles: {
        fillColor: [122, 28, 28],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // ✅ Guardar
    doc.save('Listado_Ciudadanos.pdf');
  }

  getBase64ImageFromURL(url: string): Promise<string> {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      });
  }

}