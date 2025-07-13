import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CiudadanoService {
  private baseUrl = 'http://localhost:3000/api/v1/ciudadanos'; // Cambia la URL si usas otro backend

  constructor(private http: HttpClient) {}

  getCiudadanos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  setCiudadano(ciudadano: any): void {
    sessionStorage.setItem('ciudadanoSeleccionado', JSON.stringify(ciudadano));
  }

  getCiudadanoSeleccionado(): any {
    const ciudadano = sessionStorage.getItem('ciudadanoSeleccionado');
    return ciudadano ? JSON.parse(ciudadano) : null;
  }
  // 🔥 Nuevo: Método para registrar un ciudadano
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
  getCiudadanoPorId(id: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/${id}`);
}
getCargosDelCiudadano(id: number) {
  return this.http.get<any[]>(`http://localhost:3000/api/v1/servicios-ciudadanos/ciudadano/${id}`);
}

}
