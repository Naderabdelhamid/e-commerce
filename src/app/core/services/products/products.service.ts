import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ProductListParams,
  ProductsResponse,
} from '../../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httClient = inject(HttpClient);

  getALLProducts(
    pageNumber: number = 1,
    filters: ProductListParams = {}
  ): Observable<ProductsResponse> {
    let params = new HttpParams().set('page', String(pageNumber));

    if (filters.priceGte != null && !Number.isNaN(filters.priceGte)) {
      params = params.set('price[gte]', String(filters.priceGte));
    }

    if (filters.priceLte != null && !Number.isNaN(filters.priceLte)) {
      params = params.set('price[lte]', String(filters.priceLte));
    }

    if (filters.categoryId) {
      params = params.set('category[in]', filters.categoryId);
    }

    if (filters.brand) {
      params = params.set('brand', filters.brand);
    }

    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    if (filters.limit != null && !Number.isNaN(filters.limit)) {
      params = params.set('limit', String(filters.limit));
    }

    return this.httClient.get<ProductsResponse>(
      environment.baseUrl + 'products',
      { params }
    );
  }
}
