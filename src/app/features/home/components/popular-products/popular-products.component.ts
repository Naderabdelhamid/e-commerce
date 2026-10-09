import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Product } from '../../../../core/models/product.interface';
import { ProductsService } from '../../../../core/services/products/products.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popular-products',
  imports: [CardComponent, RouterLink],
  templateUrl: './popular-products.component.html',
  styleUrl: './popular-products.component.css',
})
export class PopularProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productsList: Product[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.getAllProductsData();
  }

  getAllProductsData(): void {
    this.isLoading = true;
    this.productsService.getALLProducts(1, { limit: 12 }).subscribe({
      next: (res) => {
        this.productsList = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
}
