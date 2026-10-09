import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CartResponse } from '../models/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  readonly cartCount = signal<number>(0);

  addProductToCart(id: string): Observable<CartResponse> {
    return this.httpClient
      .post<CartResponse>(environment.baseUrl + 'cart', {
        productId: id,
      })
      .pipe(
        tap((res) => {
          if (res.numOfCartItems !== undefined) {
            this.cartCount.set(res.numOfCartItems);
          }
        })
      );
  }

  getLoggesUserCart(): Observable<CartResponse> {
    return this.httpClient.get<CartResponse>(environment.baseUrl + 'cart').pipe(
      tap((res) => {
        if (res.numOfCartItems !== undefined) {
          this.cartCount.set(res.numOfCartItems);
        }
      })
    );
  }

  removeProductFromCart(id: string): Observable<CartResponse> {
    return this.httpClient
      .delete<CartResponse>(environment.baseUrl + `cart/${id}`)
      .pipe(
        tap((res) => {
          if (res.numOfCartItems !== undefined) {
            this.cartCount.set(res.numOfCartItems);
          }
        })
      );
  }

  updeteCartCount(id: string, count: number): Observable<CartResponse> {
    return this.httpClient
      .put<CartResponse>(environment.baseUrl + `cart/${id}`, {
        count: count,
      })
      .pipe(
        tap((res) => {
          if (res.numOfCartItems !== undefined) {
            this.cartCount.set(res.numOfCartItems);
          }
        })
      );
  }

  clearUserCart(): Observable<CartResponse> {
    return this.httpClient
      .delete<CartResponse>(environment.baseUrl + 'cart')
      .pipe(
        tap(() => {
          this.cartCount.set(0);
        })
      );
  }

  clear(): void {
    this.cartCount.set(0);
  }
}
