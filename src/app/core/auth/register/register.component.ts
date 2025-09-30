import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from '../services/toast.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CommonModule, NgClass } from '@angular/common';
@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    InputComponent,
    NgClass,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' = 'info';

  flag: boolean = true;

  msError: string = '';
  isLoading: boolean = false;

  // دي الطريقه الاةلي الي تحت التانيه والاسهل ف السينتاكس
  registerForm!: FormGroup;

  //  دي الطريقه التانيه والاسهل ف السينتاكس
  /*   registerForm: FormGroup = this.fb.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],

      password: [
        null,
        [Validators.required, Validators.pattern('^[A-Z][a-z0-9]{3,8}$')],
      ],
      rePassword: [
        null,
        [Validators.required, Validators.pattern('^[A-Z][a-z0-9]{3,8}$')],
      ],
      phone: [
        null,
        [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')],
      ],
    },
    { validators: this.confirmPassword }
  ); */

  ngOnInit(): void {
    this.initForm();
    this.showToast('Welcome! Please register to continue.', 'info');
  }

  initForm(): void {
    this.registerForm = new FormGroup(
      {
        name: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]),

        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern('^[A-Z][a-z0-9]{3,8}$'),
        ]),

        rePassword: new FormControl(null, [
          Validators.required,
          Validators.pattern('^[A-Z][a-z0-9]{3,8}$'),
        ]),

        phone: new FormControl(null, [
          Validators.required,
          Validators.pattern('^01[0125][0-9]{8}$'),
        ]),
      },
      { validators: this.confirmPassword }
    );
  }

  confirmPassword(group: AbstractControl) {
    if (group.get('password')?.value === group.get('rePassword')?.value) {
      return null;
    } else {
      group.get('rePassword')?.setErrors({ mismatch: true });

      return { mismatch: true };
    }
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = '';
    }, 4000); // 4 ثواني و تختفي تلقائيًا
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      this.authService.registerForm(this.registerForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.showToast('Registration successful 🎉', 'success');

            // navigate to login path login
            this.msError = '';

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 500);
          }
          this.isLoading = false;
        },
        error: (err) => {
          // show error message
          this.msError = err.error.message;
          this.showToast(err.error.message || 'Something went wrong', 'error');
          this.isLoading = false;
        },
      });
    } else {
      // show all error message

      this.registerForm.setErrors({ mismatch: true }); // بيظهر اي ايرور موجود عموما
      this.registerForm.markAllAsTouched();
      this.showToast('Please fix the errors in the form', 'error');
    }
  }
}
