import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TokenService {
  get(): string | null {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
  }

  isLoggedIn(): boolean {
    return this.get() != null;
  }

  clear() {
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('access_token')
  }
}
