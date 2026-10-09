import { Component, inject, OnInit, signal } from '@angular/core';
import { OrdersService } from '../checkout/services/orders.service';
import { AuthService } from '../../core/auth/services/auth.service';
import { UserOrder } from '../checkout/models/order.interface';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly authService = inject(AuthService);

  readonly orders = signal<UserOrder[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const user = this.authService.currentUser() || this.authService.decodeToken();
    const userId = user?.id;

    if (!userId) {
      this.errorMessage.set('User session not found. Please log in again.');
      this.isLoading.set(false);
      return;
    }

    this.ordersService.getUserOrders(userId).subscribe({
      next: (res) => {
        this.orders.set(res || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Failed to retrieve your orders.'
        );
        this.isLoading.set(false);
      },
    });
  }
}
