import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CiudadanoService {
  private baseUrl = 'http://localhost:3000/api/v1/ciudadanos';
  private baseUrlServicios = 'http://localhost:3000/api/v1/servicios-ciudadanos';

  constructor(private http: HttpClient) {}

  // Obtener todos los ciudadanos
  getCiudadanos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Guardar en sessionStorage el ciudadano seleccionado
  setCiudadano(ciudadano: any): void {
    sessionStorage.setItem('ciudadanoSeleccionado', JSON.stringify(ciudadano));
  }

  // Obtener ciudadano seleccionado desde sessionStorage
  getCiudadanoSeleccionado(): any {
    const ciudadano = sessionStorage.getItem('ciudadanoSeleccionado');
    return ciudadano ? JSON.parse(ciudadano) : null;
  }

  // Registrar un nuevo ciudadano
  crearCiudadano(dto: {
    name: string;
    last_name_father: string;
    last_name_mother: string;
    birth_date: string;
    phone: string;
    marital_status: string;
    partner?: number;
  }): Observable<any> {
    return this.http.post<any>(this.baseUrl, dto);
  }

  // Obtener un ciudadano por su ID
  getCiudadanoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Obtener cargos (servicios) asignados a un ciudadano
  getCargosDelCiudadano(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrlServicios}/ciudadano/${id}`);
  }

  // Actualizar un cargo existente (PATCH)
  actualizarCargo(id: number, datosActualizados: Partial<{
    service_id: number;
    start_date: string;
    end_date: string;
    termination_status: string;
    observations: string;
  }>): Observable<any> {
    return this.http.patch(`${this.baseUrlServicios}/${id}`, datosActualizados);
  }
}
