import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart/services/cart.service';
import { OrdersService } from './services/orders.service';
import { AddressesService } from '../../core/services/addresses/addresses.service';
import { Cart } from '../cart/models/cart.interface';
import { CreateCashOrderRequest } from './models/order.interface';
import { UserAddress } from '../../core/models/address.interface';
import { CommonModule } from '@angular/common';

import { TransPipe } from '../../shared/pipes/trans.pipe';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, CommonModule, TransPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);
  private readonly addressesService = inject(AddressesService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  checkoutForm!: FormGroup;
  cartDetials: Cart | null = null;
  savedAddresses: UserAddress[] = [];
  selectedPaymentMethod: 'cash' | 'card' = 'cash';

  isLoading = false;
  isPlacingOrder = false;
  hasError = false;
  errorMessage = '';
  formError = '';

  get isEmpty(): boolean {
    return (
      !this.isLoading &&
      !this.hasError &&
      (this.cartDetials?.products.length ?? 0) === 0
    );
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      details: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      city: ['', [Validators.required]],
    });

    this.loadCart();
    this.loadAddresses();
  }

  loadCart(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.cartService.getLoggesUserCart().subscribe({
      next: (res) => {
        this.cartDetials = res.data ?? null;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.cartDetials = null;
          this.hasError = false;
          return;
        }
        this.hasError = true;
        this.cartDetials = null;
        this.errorMessage =
          error.error?.message || 'Could not load your cart. Please try again.';
      },
    });
  }

  loadAddresses(): void {
    this.addressesService.getUserAddresses().subscribe({
      next: (res) => {
        this.savedAddresses = res.data || [];
      },
      error: () => {
        this.savedAddresses = [];
      },
    });
  }

  selectSavedAddress(addr: UserAddress): void {
    this.checkoutForm.patchValue({
      details: addr.details,
      phone: addr.phone,
      city: addr.city,
    });
  }

  setPaymentMethod(method: 'cash' | 'card'): void {
    this.selectedPaymentMethod = method;
  }

  submitOrder(): void {
    this.formError = '';

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.formError = 'Please provide valid shipping details and phone number.';
      return;
    }

    if (this.isPlacingOrder) return;
    this.isPlacingOrder = true;

    const cartId = this.cartDetials?._id;
    if (!cartId || (this.cartDetials?.products.length ?? 0) === 0) {
      this.isPlacingOrder = false;
      this.formError = 'Your cart is empty. Add products before checkout.';
      return;
    }

    const shippingBody: CreateCashOrderRequest = {
      shippingAddress: {
        details: this.checkoutForm.value.details,
        phone: this.checkoutForm.value.phone,
        city: this.checkoutForm.value.city,
      },
    };

    if (this.selectedPaymentMethod === 'cash') {
      // Cash on delivery
      this.ordersService
        .createCashOrder(cartId, shippingBody)
        .pipe(
          switchMap((orderRes) =>
            this.cartService.clearUserCart().pipe(
              catchError(() => of(null)),
              switchMap(() => of(orderRes))
            )
          )
        )
        .subscribe({
          next: () => {
            this.isPlacingOrder = false;
            this.cartService.clear();
            this.toastrService.success(
              'Order placed successfully! Thank you for shopping with us.',
              'Order Confirmed'
            );
            this.router.navigate(['/allorders']);
          },
          error: (err: HttpErrorResponse) => {
            this.isPlacingOrder = false;
            this.formError = err.error?.message || 'Could not place order.';
            this.toastrService.error(this.formError, 'Error');
          },
        });
    } else {
      // Stripe Online Card Checkout
      const returnUrl = window.location.origin;
      this.ordersService
        .createCheckoutSession(cartId, shippingBody, returnUrl)
        .subscribe({
          next: (res) => {
            this.isPlacingOrder = false;
            if (res.session?.url) {
              window.location.href = res.session.url;
            } else {
              this.toastrService.error('Failed to create payment session');
            }
          },
          error: (err: HttpErrorResponse) => {
            this.isPlacingOrder = false;
            this.formError =
              err.error?.message || 'Could not initiate online payment.';
            this.toastrService.error(this.formError, 'Error');
          },
        });
    }
  }
}
