import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CatalogoServiciosService {

  constructor(
    private http: HttpClient
  ) { }

  getCatalogoServicios(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:3000/api/v1/catalogo-servicios');
}

}
