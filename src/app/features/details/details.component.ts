import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductDetailsService } from './services/product-details.service';
import { Product } from '../../core/models/product.interface';
import { CartService } from '../cart/services/cart.service';
import { WishlistService } from '../wishlist/services/wishlist.service';
import { ProductsService } from '../../core/services/products/products.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

import { TransPipe } from '../../shared/pipes/trans.pipe';

@Component({
  selector: 'app-details',
  imports: [CommonModule, RouterLink, CardComponent, TransPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailsService = inject(ProductDetailsService);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  id: string | null = null;
  isAdding = false;
  isTogglingWishlist = false;
  isLoading = true;
  ProductDetails: Product = {} as Product;
  imageCover: string = '';
  images: string[] = [];
  quantity: number = 1;
  relatedProducts: Product[] = [];

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      if (this.id) {
        this.getProductDetailsData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  isWishlisted(): boolean {
    return this.ProductDetails?._id
      ? this.wishlistService.hasProduct(this.ProductDetails._id)
      : false;
  }

  toggleWishlist(): void {
    if (!this.ProductDetails._id || this.isTogglingWishlist) return;

    this.isTogglingWishlist = true;
    const already = this.isWishlisted();
    const req$ = already
      ? this.wishlistService.removeFromWishlist(this.ProductDetails._id)
      : this.wishlistService.addToWishlist(this.ProductDetails);

    req$.subscribe({
      next: (res) => {
        this.toastrService.success(
          res.message || (already ? 'Removed from wishlist' : 'Added to wishlist'),
          'Wishlist'
        );
        this.isTogglingWishlist = false;
      },
      error: (err) => {
        this.toastrService.error(
          err.error?.message || 'Failed to update wishlist',
          'Error'
        );
        this.isTogglingWishlist = false;
      },
    });
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addProductItemToCart(id: string): void {
    this.isAdding = true;
    this.cartService.addProductToCart(id).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.toastrService.success(response.message, 'Added to Cart');
        }
        this.isAdding = false;
      },
      error: (error) => {
        this.toastrService.error(
          error.error?.message || 'Could not add product',
          'Error'
        );
        this.isAdding = false;
      },
    });
  }

  getProductDetailsData(): void {
    this.isLoading = true;
    this.productDetailsService.getProductDetails(this.id).subscribe({
      next: (res) => {
        this.ProductDetails = res.data;
        this.imageCover = this.ProductDetails.imageCover;
        this.images = [
          this.ProductDetails.imageCover,
          ...(this.ProductDetails.images || []),
        ];
        this.isLoading = false;

        // Fetch related products from same category
        if (this.ProductDetails?.category?._id) {
          this.productsService
            .getALLProducts(1, {
              categoryId: this.ProductDetails.category._id,
              limit: 6,
            })
            .subscribe({
              next: (relRes) => {
                this.relatedProducts = (relRes.data || []).filter(
                  (p) => p._id !== this.ProductDetails._id
                );
              },
            });
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  changeImage(img: string): void {
    this.imageCover = img;
  }
}
