import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';

import { TransPipe } from '../../pipes/trans.pipe';

@Component({
  selector: 'app-card',
  imports: [RouterLink, CommonModule, TransPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input({ required: true }) product: Product = {} as Product;
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  isAdding = false;
  isTogglingWishlist = false;

  isWishlisted(): boolean {
    return this.wishlistService.hasProduct(this.product._id);
  }

  toggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.isTogglingWishlist || !this.product._id) {
      return;
    }

    this.isTogglingWishlist = true;
    const alreadyWishlisted = this.isWishlisted();
    const request$ = alreadyWishlisted
      ? this.wishlistService.removeFromWishlist(this.product._id)
      : this.wishlistService.addToWishlist(this.product);

    request$.subscribe({
      next: (response) => {
        this.toastrService.success(
          response.message ||
            (alreadyWishlisted
              ? 'Removed from wishlist'
              : 'Added to wishlist'),
          'Success'
        );
        this.isTogglingWishlist = false;
      },
      error: (error: HttpErrorResponse) => {
        this.toastrService.error(
          error.error?.message || 'Could not update wishlist',
          'Error'
        );
        this.isTogglingWishlist = false;
      },
    });
  }

  addProductItemToCart(id: string): void {
    this.isAdding = true; // to show loading state
    this.cartService.addProductToCart(id).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 'success') {
          this.toastrService.success(response.message, 'Success');
        }
        this.isAdding = false; // to stop loading state
      },
      error: (error) => {
        console.error(error);
        this.isAdding = false; // to stop loading state
      },
    });
  }
}
