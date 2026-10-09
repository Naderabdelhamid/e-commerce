import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CardComponent } from '../../shared/components/card/card.component';
import { WishlistService } from './services/wishlist.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [CardComponent, RouterLink],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  readonly wishlistItems = this.wishlistService.wishlistItems;

  isLoading = false;
  hasError = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = !this.wishlistService.wishlistItems().length;
    this.hasError = false;
    this.errorMessage = '';

    this.wishlistService.getWishlist().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error.error?.message ||
          'Could not load your wishlist. Please try again.';
        this.toastrService.error(this.errorMessage, 'Error');
      },
    });
  }
}
