export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface CreateCashOrderRequest {
  shippingAddress: ShippingAddress;
}

export interface CashOrderResponse {
  status: string;
  message?: string;
  data?: unknown;
}

export interface CheckoutSessionResponse {
  status: string;
  session: {
    url: string;
    success_url?: string;
    cancel_url?: string;
  };
}

export interface OrderItemProduct {
  _id: string;
  title: string;
  imageCover: string;
  ratingsAverage?: number;
  category?: {
    name: string;
  };
  brand?: {
    name: string;
  };
}

export interface OrderCartItem {
  _id: string;
  count: number;
  price: number;
  product: OrderItemProduct;
}

export interface UserOrder {
  _id: string;
  shippingAddress?: ShippingAddress;
  taxPrice?: number;
  shippingPrice?: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  cartItems: OrderCartItem[];
}
