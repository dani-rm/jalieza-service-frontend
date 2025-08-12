import { HttpClient, HttpHeaders } from '@angular/common/http';
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
private getAuthOptions() {
  const token = localStorage.getItem('auth_token') || '';
  return {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    }),
    withCredentials: true,
  };
}
  getCiudadanos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, this.getAuthOptions());
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
    return this.http.post<any>(this.baseUrl, dto, this.getAuthOptions());
  }

  getCiudadanoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, this.getAuthOptions());
  }

  getCargosDelCiudadano(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlServicios}/ciudadano/${id}`, this.getAuthOptions());
  }

  actualizarCargo(id: number, datosActualizados: Partial<{
    service_id: number;
    start_date: string;
    end_date: string;
    termination_status: string;
    observations: string;
  }>): Observable<any> {
    return this.http.patch(`${this.baseUrlServicios}/${id}`, datosActualizados, this.getAuthOptions());
  }

  actualizarCiudadano(id: number, dto: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, dto,this.getAuthOptions());
  }

  getCargos(): Observable<any[]> {
    const url = this.baseUrlCatalogoServicios;
    console.log('URL para getCargos:', url);
    return this.http.get<any[]>(url,this.getAuthOptions());
  }

  eliminarCiudadano(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthOptions());
  }

  restaurarCiudadano(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/restaurar`, {}, this.getAuthOptions());
  }
}
