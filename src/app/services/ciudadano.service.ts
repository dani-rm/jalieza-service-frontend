import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CiudadanoService {
  private baseUrl = `${environment.apiUrl}/ciudadanos`;
  private baseUrlServicios = `${environment.apiUrl}/servicios-ciudadanos`;
  private baseUrlCatalogoServicios = `${environment.apiUrl}/catalogo-servicios`;

  constructor(private http: HttpClient) {}

  getCiudadanos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { withCredentials: true });
  }

  setCiudadano(ciudadano: any): void {
    sessionStorage.setItem('ciudadanoSeleccionado', JSON.stringify(ciudadano));
  }

  getCiudadanoSeleccionado(): any {
    const ciudadano = sessionStorage.getItem('ciudadanoSeleccionado');
    return ciudadano ? JSON.parse(ciudadano) : null;
  }

  crearCiudadano(dto: {
    name: string;
    last_name_father: string;
    last_name_mother: string;
    birth_date: string;
    phone: string;
    marital_status: string;
    partner?: number;
  }): Observable<any> {
    return this.http.post<any>(this.baseUrl, dto, { withCredentials: true });
  }

  getCiudadanoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  getCargosDelCiudadano(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlServicios}/ciudadano/${id}`, { withCredentials: true });
  }

  actualizarCargo(id: number, datosActualizados: Partial<{
    service_id: number;
    start_date: string;
    end_date: string;
    termination_status: string;
    observations: string;
  }>): Observable<any> {
    return this.http.patch(`${this.baseUrlServicios}/${id}`, datosActualizados, { withCredentials: true });
  }

  actualizarCiudadano(id: number, dto: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, dto, { withCredentials: true });
  }

  getCargos(): Observable<any[]> {
    const url = this.baseUrlCatalogoServicios;
    console.log('URL para getCargos:', url);
    return this.http.get<any[]>(url, { withCredentials: true });
  }

  eliminarCiudadano(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  restaurarCiudadano(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/restaurar`, {}, { withCredentials: true });
  }
}
