import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServicioCatalogo, CrearServicioRequest, ActualizarServicioRequest, Orden } from '../interfaces/catalogo-servicios.interface';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiciosCrudService {
  private baseUrl = `${environment.apiUrl}/catalogo-servicios`;
  private baseUrlOrdenes = `${environment.apiUrl}/catalogo-orden`;

  constructor(private http: HttpClient) {}

  private getAuthOptions() {
    const token = localStorage.getItem('auth_token') || '';
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      }),
      withCredentials: true,
    };
  }

  // ✅ Obtener todos los servicios del catálogo
  getServicios(): Observable<ServicioCatalogo[]> {
    return this.http.get<ServicioCatalogo[]>(this.baseUrl, this.getAuthOptions());
  }

  // ✅ Obtener un servicio por ID
  getServicioPorId(id: number): Observable<ServicioCatalogo> {
    return this.http.get<ServicioCatalogo>(`${this.baseUrl}/${id}`, this.getAuthOptions());
  }

  // ✅ Crear nuevo servicio
  crearServicio(servicio: CrearServicioRequest): Observable<ServicioCatalogo> {
    return this.http.post<ServicioCatalogo>(this.baseUrl, servicio, this.getAuthOptions());
  }

  // ✅ Actualizar servicio existente
  actualizarServicio(id: number, servicio: ActualizarServicioRequest): Observable<ServicioCatalogo> {
    return this.http.patch<ServicioCatalogo>(`${this.baseUrl}/${id}`, servicio, this.getAuthOptions());
  }

  // ✅ Eliminar servicio (soft delete)
  eliminarServicio(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthOptions());
  }

  // ✅ Restaurar servicio eliminado
  restaurarServicio(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/restaurar`, {}, this.getAuthOptions());
  }

  // ✅ Obtener todas las órdenes disponibles
  getOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.baseUrlOrdenes, this.getAuthOptions());
  }

  // ✅ Agrupar servicios por orden
  agruparServiciosPorOrden(servicios: ServicioCatalogo[]): { [key: string]: ServicioCatalogo[] } {
    return servicios.reduce((grupos, servicio) => {
      const ordenNombre = servicio.order.order_name;
      if (!grupos[ordenNombre]) {
        grupos[ordenNombre] = [];
      }
      grupos[ordenNombre].push(servicio);
      return grupos;
    }, {} as { [key: string]: ServicioCatalogo[] });
  }
}
