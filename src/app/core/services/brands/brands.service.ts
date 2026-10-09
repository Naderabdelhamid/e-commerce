import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BrandDetailsResponse, BrandsResponse } from '../../models/brand.interface';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);

  getAllBrands(limit: number = 24, page: number = 1): Observable<BrandsResponse> {
    return this.httpClient.get<BrandsResponse>(
      `${environment.baseUrl}brands?limit=${limit}&page=${page}`
    );
  }

  getSpecificBrand(id: string): Observable<BrandDetailsResponse> {
    return this.httpClient.get<BrandDetailsResponse>(
      `${environment.baseUrl}brands/${id}`
    );
  }
}
