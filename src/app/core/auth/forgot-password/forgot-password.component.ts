import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  // Step 1: email, Step 2: verifyCode, Step 3: resetPassword
  step: 1 | 2 | 3 = 1;
  isLoading = false;
  userEmail = '';

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  codeForm: FormGroup = this.fb.group({
    resetCode: ['', [Validators.required, Validators.minLength(4)]],
  });

  newPasswordForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  sendResetCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.emailForm.value.email;
    this.userEmail = email;

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastr.success(
          res.message || 'Reset code sent to your email',
          'Success'
        );
        this.step = 2;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(
          err.error?.message || 'Could not send reset code',
          'Error'
        );
      },
    });
  }

  verifyCode(): void {
    if (this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const resetCode = this.codeForm.value.resetCode;

    this.authService.verifyResetCode(resetCode).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastr.success('Code verified successfully', 'Success');
        this.step = 3;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err.error?.message || 'Invalid reset code', 'Error');
      },
    });
  }

  resetPassword(): void {
    if (this.newPasswordForm.invalid) {
      this.newPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const newPassword = this.newPasswordForm.value.newPassword;

    this.authService
      .resetPassword({
        email: this.userEmail,
        newPassword: newPassword,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success(
            'Password reset successfully! Please sign in.',
            'Success'
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(
            err.error?.message || 'Failed to reset password',
            'Error'
          );
        },
      });
  }
}
