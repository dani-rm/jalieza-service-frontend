import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

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

  guardarSesion(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.authStatus.next(true); // Avisar que ya hay sesión activa
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  logout(): void {
    this.http.post('http://localhost:3000/api/v1/auth/logout', {}, {
      withCredentials: true, // importante para cookies
    }).subscribe({
      next: () => {
        localStorage.removeItem(this.TOKEN_KEY);
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
