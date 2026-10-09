import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CashOrderResponse,
  CheckoutSessionResponse,
  CreateCashOrderRequest,
  UserOrder,
} from '../models/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient);

  createCashOrder(
    cartId: string,
    body: CreateCashOrderRequest
  ): Observable<CashOrderResponse> {
    return this.httpClient.post<CashOrderResponse>(
      `${environment.baseUrl}orders/${cartId}`,
      body
    );
  }

  createCheckoutSession(
    cartId: string,
    body: CreateCashOrderRequest,
    returnUrl: string
  ): Observable<CheckoutSessionResponse> {
    const encodedUrl = encodeURIComponent(returnUrl);
    return this.httpClient.post<CheckoutSessionResponse>(
      `${environment.baseUrl}orders/checkout-session/${cartId}?url=${encodedUrl}`,
      body
    );
  }

  getUserOrders(userId: string): Observable<UserOrder[]> {
    return this.httpClient.get<UserOrder[]>(
      `${environment.baseUrl}orders/user/${userId}`
    );
  }
}
