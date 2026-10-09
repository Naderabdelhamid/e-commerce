import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AddressResponse, UserAddress } from '../../models/address.interface';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private readonly httpClient = inject(HttpClient);

  getUserAddresses(): Observable<AddressResponse> {
    return this.httpClient.get<AddressResponse>(`${environment.baseUrl}addresses`);
  }

  addAddress(address: UserAddress): Observable<AddressResponse> {
    return this.httpClient.post<AddressResponse>(
      `${environment.baseUrl}addresses`,
      address
    );
  }

  removeAddress(id: string): Observable<AddressResponse> {
    return this.httpClient.delete<AddressResponse>(
      `${environment.baseUrl}addresses/${id}`
    );
  }
}
