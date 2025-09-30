import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { Product } from '../../core/models/product.interface';
import { NgxPaginationModule } from 'ngx-pagination';

import { ProductsService } from '../../core/services/products/products.service';

@Component({
  selector: 'app-product',
  imports: [CardComponent, NgxPaginationModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productsList: Product[] = [];

  pageSize!: number;
  total!: number;
  p!: number;

  ngOnInit(): void {
    this.getAllProductsData();
  }

  getAllProductsData(pageNumber: number = 1): void {
    this.productsService.getALLProducts(pageNumber).subscribe({
      next: (res) => {
        console.log(res.data);
        this.productsList = res.data;
        this.pageSize = res.metadata.limit;
        this.p = res.metadata.currentPage;
        this.total = res.results;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
