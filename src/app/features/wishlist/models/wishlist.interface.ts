import { Product } from '../../../core/models/product.interface';

export interface WishlistGetResponse {
  status: string;
  count?: number;
  message?: string;
  data: Product[];
}

export interface WishlistMutationResponse {
  status: string;
  message?: string;
  data: string[];
}
