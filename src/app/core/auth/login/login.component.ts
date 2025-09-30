import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ToastService } from '../services/toast.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, NgClass, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' = 'info';

  subscription: Subscription = new Subscription();
  flag: boolean = true;

  msError: string = '';
  isLoading: boolean = false;

  // بص دي الطريقه الاولي الي تحتها الطريقه التانيه الي قالها ف اخر فيديو هو قال انها احسن واسهل

  /*   loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern('^[A-Z][a-z0-9]{3,8}$'),
    ]),
  }); */

  //  طريقه تانيه ينفع اكريت بيها الفورم بتاعتي

  // عشان السينتاكس بتاعتها ابسط

  loginForm!: FormGroup;

  //

  ngOnInit(): void {
    this.initForm();
    this.showToast('Welcome! Please Login to continue.', 'info');
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [Validators.required, Validators.pattern('^[A-Z][a-z0-9]{3,8}$')],
      ],
    });
  }
  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = '';
    }, 4000); // 4 ثواني و تختفي تلقائيًا
  }
  submitForm(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.subscription.unsubscribe();

      this.subscription = this.authService
        .loginForm(this.loginForm.value)
        .subscribe({
          next: (res) => {
            if (res.message === 'success') {
              this.showToast('Login successful 🎉', 'success');

              // navigate to home path home
              this.msError = '';

              setTimeout(() => {
                this.router.navigate(['/home']);
              }, 500);
            }
            this.isLoading = false;
          },
          error: (err) => {
            // show error message
            this.msError = err.error.message;
            this.showToast(
              err.error.message || 'Something went wrong',
              'error'
            );

            this.isLoading = false;
          },
        });
    } else {
      // show all error message
      this.loginForm.setErrors({ mismatch: true }); // بيظهر اي ايرور موجود عموما
      this.loginForm.markAllAsTouched();
      this.showToast('Please fix the errors in the form', 'error');
    }
  }
}
