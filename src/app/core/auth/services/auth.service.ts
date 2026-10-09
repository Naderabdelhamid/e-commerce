import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface UserPayload {
  id?: string;
  name?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  readonly currentUser = signal<UserPayload | null>(null);

  constructor() {
    this.syncUser();
  }

  syncUser(): void {
    const token = this.cookieService.get('token');
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token);
        this.currentUser.set(decoded);
      } catch {
        this.currentUser.set(null);
      }
    } else {
      this.currentUser.set(null);
    }
  }

  registerForm(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/signup', data);
  }

  loginForm(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/signin', data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'auth/forgotPasswords', {
      email,
    });
  }

  verifyResetCode(resetCode: string): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + 'auth/verifyResetCode',
      { resetCode }
    );
  }

  resetPassword(data: { email: string; newPassword: string }): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + 'auth/resetPassword',
      data
    );
  }

  changeMyPassword(data: {
    currentPassword: string;
    password: string;
    rePassword: string;
  }): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + 'users/changeMyPassword',
      data
    );
  }

  updateUserData(data: {
    name: string;
    email: string;
    phone: string;
  }): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'users/updateMe/', data);
  }

  logOut(): void {
    this.cookieService.delete('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  decodeToken(): UserPayload | null {
    const token = this.cookieService.get('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<UserPayload>(token);
      this.currentUser.set(decoded);
      return decoded;
    } catch (error) {
      this.logOut();
      return null;
    }
  }
}
