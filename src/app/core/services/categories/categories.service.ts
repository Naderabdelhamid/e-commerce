import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CategoriesResponse,
  Category,
  SubCategoriesResponse,
} from '../../models/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);

  getAllCategories(limit: number = 24, page: number = 1): Observable<CategoriesResponse> {
    return this.httpClient.get<CategoriesResponse>(
      `${environment.baseUrl}categories?limit=${limit}&page=${page}`
    );
  }

  getSpecificCategory(id: string): Observable<{ data: Category }> {
    return this.httpClient.get<{ data: Category }>(
      `${environment.baseUrl}categories/${id}`
    );
  }

  getAllSubcategories(limit: number = 50): Observable<SubCategoriesResponse> {
    return this.httpClient.get<SubCategoriesResponse>(
      `${environment.baseUrl}subcategories?limit=${limit}`
    );
  }

  getSubcategoriesOfCategory(categoryId: string): Observable<SubCategoriesResponse> {
    return this.httpClient.get<SubCategoriesResponse>(
      `${environment.baseUrl}categories/${categoryId}/subcategories`
    );
  }
}
