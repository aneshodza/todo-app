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
import { LoginResponse, RegisterResponse } from '@models';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  hidePassword = true;
  serverError = null;
  private router = inject(Router);

  constructor(private authService: AuthService) { }

  submit() {
    const { username, email, password } = this.registerForm.value;

    if (this.registerForm.invalid) return;

    this.authService.register(username!, email!, password!).subscribe({
      next: (_res: RegisterResponse) => {
        this.authService.login(email!, password!, false).subscribe({
          next: (res: LoginResponse) => {
            this.authService.saveToken(res.accessToken, false)
            this.router.navigateByUrl('/', { replaceUrl: true })
          },
          error: (_err) => this.router.navigateByUrl('/', { replaceUrl: true })
        })
      },
      error: (err) => this.serverError = err.error.message,
    });
  }
}
