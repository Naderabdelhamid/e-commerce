import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httClient = inject(HttpClient);

  getALLProducts(pageNumber: number = 1): Observable<any> {
    return this.httClient.get(
      environment.baseUrl + `products?page=${pageNumber}`
    );
  }
}
