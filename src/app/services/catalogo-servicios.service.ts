import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CatalogoServiciosService {

  constructor(
    private http: HttpClient
  ) { }

getCatalogoServicios(): Observable<any[]> {
  const url = `${environment.apiUrl}/catalogo-servicios`;
  return this.http.get<any[]>(url);
}

}
