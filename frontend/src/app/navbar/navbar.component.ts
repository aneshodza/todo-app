import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TokenService } from 'app/services/token.service';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true
})
export class NavbarComponent {
  token = inject(TokenService)
  router = inject(Router)

  logout() {
    this.token.clear();
    window.location.reload();
  }
}
