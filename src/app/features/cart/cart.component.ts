import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { Cart } from './models/cart.interface';
import { ToastrService } from 'ngx-toastr';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TransPipe } from '../../shared/pipes/trans.pipe';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe, FormsModule, CommonModule, RouterLink, TransPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(ToastrService);

  cartDetials: Cart | null = null;
  isLoading = false;
  isClearing = false;
  hasError = false;
  errorMessage = '';
  promoCode: string = '';
  discountPercent: number = 0;

  get cartProducts() {
    return this.cartDetials?.products ?? [];
  }

  get isEmpty(): boolean {
    return !this.isLoading && !this.hasError && this.cartProducts.length === 0;
  }

  get canCheckout(): boolean {
    return !this.isLoading && !this.hasError && this.cartProducts.length > 0;
  }

  get subtotal(): number {
    return this.cartDetials?.totalCartPrice ?? 0;
  }

  get discountAmount(): number {
    return this.subtotal * (this.discountPercent / 100);
  }

  get totalAfterDiscount(): number {
    return Math.max(0, this.subtotal - this.discountAmount);
  }

  ngOnInit(): void {
    this.getLoggedUserData();
  }

  getLoggedUserData(): void {
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

  removeItem(id: string): void {
    this.cartService.removeProductFromCart(id).subscribe({
      next: (res) => {
        this.cartDetials = res.data ?? null;
        this.toastService.info('Item removed from cart', 'Cart Updated');
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(
          error.error?.message || 'Could not remove this item'
        );
      },
    });
  }

  updeteCount(id: string, oldCount: number, newCount: number): void {
    if (newCount < 1) {
      this.removeItem(id);
      return;
    }

    this.cartService.updeteCartCount(id, newCount).subscribe({
      next: (res) => {
        this.cartDetials = res.data ?? null;
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(
          error.error?.message || 'Could not update quantity'
        );
      },
    });
  }

  clearEntireCart(): void {
    if (!confirm('Are you sure you want to empty your shopping cart?')) {
      return;
    }

    this.isClearing = true;
    this.cartService.clearUserCart().subscribe({
      next: () => {
        this.cartDetials = null;
        this.isClearing = false;
        this.toastService.success('Cart cleared successfully', 'Cart');
      },
      error: () => {
        this.isClearing = false;
        this.toastService.error('Failed to clear cart');
      },
    });
  }

  applyPromo() {
    const code = this.promoCode.trim().toUpperCase();
    if (code === 'FRESH10' || code === 'SAVE10') {
      this.discountPercent = 10;
      this.toastService.success('Promo Code Applied: 10% Discount!', 'Savings');
    } else if (code === 'FRESH20') {
      this.discountPercent = 20;
      this.toastService.success('Promo Code Applied: 20% Discount!', 'Super Deal');
    } else {
      this.discountPercent = 0;
      this.toastService.error('Invalid promo code. Try "FRESH10"', 'Invalid Coupon');
    }
  }
}
