import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { Product, ProductListParams } from '../../core/models/product.interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductsService } from '../../core/services/products/products.service';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Category } from '../../core/models/category.interface';
import { Brand } from '../../core/models/brand.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [CardComponent, NgxPaginationModule, FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly brandsService = inject(BrandsService);
  private readonly route = inject(ActivatedRoute);

  productsList: Product[] = [];
  categoriesList: Category[] = [];
  brandsList: Brand[] = [];

  pageSize = 12;
  total = 0;
  p = 1;
  text = '';
  minPrice: number | string | null = null;
  maxPrice: number | string | null = null;
  selectedCategoryId = '';
  selectedBrandId = '';
  selectedSort = '';

  isLoading = false;
  hasError = false;
  errorMessage = '';

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllBrands();

    this.route.queryParams.subscribe((params) => {
      if (params['keyword']) {
        this.text = params['keyword'];
      }
      if (params['category']) {
        this.selectedCategoryId = params['category'];
      }
      if (params['brand']) {
        this.selectedBrandId = params['brand'];
      }
      this.getAllProductsData(1);
    });
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories(50).subscribe({
      next: (res) => {
        this.categoriesList = res.data ?? [];
      },
      error: () => {
        this.categoriesList = [];
      },
    });
  }

  getAllBrands(): void {
    this.brandsService.getAllBrands(50).subscribe({
      next: (res) => {
        this.brandsList = res.data ?? [];
      },
      error: () => {
        this.brandsList = [];
      },
    });
  }

  getAllProductsData(pageNumber: number = 1): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    this.p = pageNumber;

    this.productsService
      .getALLProducts(pageNumber, this.buildFilters())
      .subscribe({
        next: (res) => {
          this.productsList = res.data ?? [];
          this.pageSize = res.metadata?.limit ?? 12;
          this.p = res.metadata?.currentPage ?? pageNumber;
          this.total = res.results ?? this.productsList.length;
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.productsList = [];
          this.total = 0;
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage =
            err.error?.message || 'Could not load products. Please try again.';
        },
      });
  }

  searchProducts(): void {
    this.getAllProductsData(1);
  }

  onPageChange(page: number): void {
    if (page === this.p) return;
    this.getAllProductsData(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onFilterChange(): void {
    this.getAllProductsData(1);
  }

  resetFilters(): void {
    this.text = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedCategoryId = '';
    this.selectedBrandId = '';
    this.selectedSort = '';
    this.getAllProductsData(1);
  }

  private buildFilters(): ProductListParams {
    const filters: ProductListParams = {
      limit: 12,
    };
    const keyword = this.text.trim();

    if (keyword) {
      filters.keyword = keyword;
    }

    const min = this.toOptionalNumber(this.minPrice);
    if (min != null) {
      filters.priceGte = min;
    }

    const max = this.toOptionalNumber(this.maxPrice);
    if (max != null) {
      filters.priceLte = max;
    }

    if (this.selectedCategoryId) {
      filters.categoryId = this.selectedCategoryId;
    }

    if (this.selectedBrandId) {
      filters.brand = this.selectedBrandId;
    }

    if (this.selectedSort) {
      filters.sort = this.selectedSort;
    }

    return filters;
  }

  private toOptionalNumber(value: number | string | null): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }
}
