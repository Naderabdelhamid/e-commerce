import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, finalize, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../core/models/product.interface';
import {
  WishlistGetResponse,
  WishlistMutationResponse,
} from '../models/wishlist.interface';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  private readonly ids = signal<string[]>([]);
  private readonly items = signal<Product[]>([]);
  private pendingLoad: Observable<WishlistGetResponse> | null = null;
  private hasLoaded = false;

  readonly wishlistIds = this.ids.asReadonly();
  readonly wishlistItems = this.items.asReadonly();
  readonly wishlistCount = computed(() => this.ids().length);

  hasProduct(productId: string): boolean {
    return this.ids().includes(productId);
  }

  getWishlist(): Observable<WishlistGetResponse> {
    if (this.hasLoaded && !this.pendingLoad) {
      return of({
        status: 'success',
        count: this.ids().length,
        data: this.items(),
      });
    }

    if (this.pendingLoad) {
      return this.pendingLoad;
    }

    this.pendingLoad = this.httpClient
      .get<WishlistGetResponse>(environment.baseUrl + 'wishlist', this.getAuthOptions())
      .pipe(
        tap((res) => this.applyGetResponse(res)),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.ids.set([]);
            this.items.set([]);
            this.hasLoaded = true;
            return of({ status: 'success', count: 0, data: [] as Product[] });
          }
          return throwError(() => error);
        }),
        finalize(() => {
          this.pendingLoad = null;
        }),
        shareReplay(1)
      );

    return this.pendingLoad;
  }

  addToWishlist(product: Product): Observable<WishlistMutationResponse> {
    return this.httpClient
      .post<WishlistMutationResponse>(
        environment.baseUrl + 'wishlist',
        { productId: product._id },
        this.getAuthOptions()
      )
      .pipe(
        tap((res) => {
          this.ids.set(this.mergeIds(res.data, product._id));
          if (!this.items().some((item) => item._id === product._id)) {
            this.items.set([...this.items(), product]);
          }
        })
      );
  }

  removeFromWishlist(productId: string): Observable<WishlistMutationResponse> {
    return this.httpClient
      .delete<WishlistMutationResponse>(
        environment.baseUrl + `wishlist/${productId}`,
        this.getAuthOptions()
      )
      .pipe(
        tap((res) => {
          this.ids.set(this.idsAfterRemove(res.data, productId));
          this.items.set(this.items().filter((item) => item._id !== productId));
        })
      );
  }

  clear(): void {
    this.ids.set([]);
    this.items.set([]);
    this.hasLoaded = false;
    this.pendingLoad = null;
  }

  private applyGetResponse(res: WishlistGetResponse): void {
    const products = res.data ?? [];
    this.items.set(products);
    this.ids.set(products.map((product) => product._id));
    this.hasLoaded = true;
  }

  private mergeIds(data: string[] | undefined, productId: string): string[] {
    if (Array.isArray(data) && data.every((id) => typeof id === 'string')) {
      return data.includes(productId) ? data : [...data, productId];
    }
    return this.ids().includes(productId)
      ? this.ids()
      : [...this.ids(), productId];
  }

  private idsAfterRemove(
    data: string[] | undefined,
    productId: string
  ): string[] {
    if (Array.isArray(data) && data.every((id) => typeof id === 'string')) {
      return data.filter((id) => id !== productId);
    }
    return this.ids().filter((id) => id !== productId);
  }

  private getAuthOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        token: this.cookieService.get('token'),
      }),
    };
  }
}
