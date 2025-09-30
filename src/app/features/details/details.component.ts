import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsService } from './services/product-details.service';
import { Product } from '../../core/models/product.interface';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailsService = inject(ProductDetailsService);

  id: string | null = null;
  ProductDetails: Product = {} as Product;

  ngOnInit(): void {
    this.getProductId();
    this.getProductDetailsData();
  }

  //

  getProductId(): void {
    this.activatedRoute.params;
    this.activatedRoute.paramMap.subscribe({
      next: (urlParms) => {
        this.id = urlParms.get('id');
      },
    }); //ده احسن
  }

  //

  getProductDetailsData(): void {
    this.productDetailsService.getProductDetails(this.id).subscribe({
      next: (res) => {
        console.log(res);
        this.ProductDetails = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
