import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5161/api/auth';

  constructor(private http: HttpClient) {}

  login(identifier: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { identifier, password, rememberMe });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  saveToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem('access_token', token);
      sessionStorage.removeItem('access_token');
    } else {
      sessionStorage.setItem('access_token', token);
      localStorage.removeItem('access_token');
    }
  }
}
