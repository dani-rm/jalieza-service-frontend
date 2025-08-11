import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';

  // Estado reactivo para saber si está autenticado o no
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.authStatus.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /*guardarSesion(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.authStatus.next(true); // Avisar que ya hay sesión activa
  }*/
private parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

guardarSesion(token: string): void {
  localStorage.setItem(this.TOKEN_KEY, token);
  const decoded = this.parseJwt(token);
  console.log('Token decodificado:', decoded);
  if (decoded?.role_id) {
    localStorage.setItem(this.ROLE_KEY, decoded.role_id.toString());
  } else {
    console.warn('⚠️ Token no contiene role_id');
  }
  this.authStatus.next(true);
}

getUsuario(): any | null {
  const token = localStorage.getItem(this.TOKEN_KEY);
  if (!token) return null;

  return this.parseJwt(token); // Ya tienes parseJwt implementado 👌
}




  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  // auth.service.ts
 /*getUserRole(): string | null {
 const token = localStorage.getItem(this.TOKEN_KEY);
  if (!token) return null;

  const payload = JSON.parse(atob(token.split('.')[1]));

  const roleMap: { [key: number]: string } = {
    3: 'superAdmin',
    4: 'visualizador',
     // por ejemplo
  };

  return roleMap[payload.role_id] || null;
}*/

logout(): void {
  const url = `${environment.apiUrl}/auth/logout`;

  this.http.post(url, {}, {
    withCredentials: true, // importante para cookies
  }).subscribe({
    next: () => {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ROLE_KEY);
      this.authStatus.next(false); // Avisar que cerró sesión
      this.router.navigate(['/home']);
      console.log('🚪 Sesión cerrada');
    },
    error: err => {
      console.error('❌ Error al cerrar sesión:', err);
    }
  });
}
}
