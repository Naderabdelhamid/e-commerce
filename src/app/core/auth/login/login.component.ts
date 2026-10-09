import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly cookieService = inject(CookieService);

  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  submitForm(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.warning('Please enter valid email and password', 'Validation Error');
      return;
    }

    this.isLoading = true;
    this.authService.loginForm(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.message === 'success' || res.token) {
          this.cookieService.set('token', res.token);
          this.authService.syncUser();
          this.toastr.success('Welcome back to FreshCart!', 'Login Successful');
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || 'Invalid email or password';
        this.toastr.error(msg, 'Authentication Failed');
      },
    });
  }
}
