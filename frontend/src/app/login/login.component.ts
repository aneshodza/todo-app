import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'app/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { LoginResponse } from '@models';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatCheckbox,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    identifier: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });
  hidePassword = true;
  serverError = null;
  private router = inject(Router);

  constructor(private authService: AuthService) { }

  submit() {
    const { identifier, password, rememberMe } = this.loginForm.value;

    if (this.loginForm.invalid) return;

    this.authService.login(identifier!, password!, rememberMe!).subscribe({
      next: (res: LoginResponse) => {

        if (rememberMe) {
          localStorage.setItem('access_token', res.accessToken);
          sessionStorage.removeItem('access_token');
          this.router.navigateByUrl('/', { replaceUrl: true })
        } else {
          sessionStorage.setItem('access_token', res.accessToken);
          localStorage.removeItem('access_token');
          this.router.navigateByUrl('/', { replaceUrl: true })
        }
      },
      error: (err) => this.serverError = err.error.message,
    });
  }
}
