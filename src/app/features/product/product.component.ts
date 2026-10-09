import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { Product } from '../../core/models/product.interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductsService } from '../../core/services/products/products.service';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Category } from '../../core/models/category.interface';
import { Brand } from '../../core/models/brand.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransPipe } from '../../shared/pipes/trans.pipe';

@Component({
  selector: 'app-product',
  imports: [CardComponent, NgxPaginationModule, FormsModule, CommonModule, TransPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly brandsService = inject(BrandsService);
  private readonly route = inject(ActivatedRoute);

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
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
      if (params['keyword'] !== undefined) {
        this.text = String(params['keyword']).trim();
      }
      if (params['category']) {
        this.selectedCategoryId = params['category'];
      }
      if (params['brand']) {
        this.selectedBrandId = params['brand'];
      }

      if (this.allProducts.length === 0) {
        this.getAllProductsData();
      } else {
        this.applyFiltersAndSort();
      }
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

    this.productsService.getALLProducts(1, { limit: 60 }).subscribe({
      next: (res) => {
        this.allProducts = res.data ?? [];
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.allProducts = [];
        this.filteredProducts = [];
        this.total = 0;
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          err.error?.message || 'Could not load products. Please try again.';
      },
    });
  }

  searchProducts(): void {
    this.applyFiltersAndSort();
  }

  onSearchInput(): void {
    this.applyFiltersAndSort();
  }

  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  onPageChange(page: number): void {
    if (page === this.p) return;
    this.p = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters(): void {
    this.text = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedCategoryId = '';
    this.selectedBrandId = '';
    this.selectedSort = '';
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let result = [...this.allProducts];

    // 1. Text Search (title, description, category, brand)
    const query = this.text.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => {
        const title = p.title?.toLowerCase() || '';
        const desc = p.description?.toLowerCase() || '';
        const cat = p.category?.name?.toLowerCase() || '';
        const brand = p.brand?.name?.toLowerCase() || '';
        return (
          title.includes(query) ||
          desc.includes(query) ||
          cat.includes(query) ||
          brand.includes(query)
        );
      });
    }

    // 2. Category Filter
    if (this.selectedCategoryId) {
      result = result.filter(
        (p) =>
          p.category?._id === this.selectedCategoryId ||
          (p as any).category === this.selectedCategoryId
      );
    }

    // 3. Brand Filter
    if (this.selectedBrandId) {
      result = result.filter(
        (p) =>
          p.brand?._id === this.selectedBrandId ||
          (p as any).brand === this.selectedBrandId
      );
    }

    // 4. Min Price Filter
    const min = this.toOptionalNumber(this.minPrice);
    if (min != null) {
      result = result.filter((p) => p.price >= min);
    }

    // 5. Max Price Filter
    const max = this.toOptionalNumber(this.maxPrice);
    if (max != null) {
      result = result.filter((p) => p.price <= max);
    }

    // 6. Sort
    if (this.selectedSort === 'price') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.selectedSort === '-price') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.selectedSort === '-ratingsAverage') {
      result.sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
    } else if (this.selectedSort === '-createdAt') {
      result.sort((a, b) => (b._id > a._id ? 1 : -1));
    }

    this.filteredProducts = result;
    this.total = result.length;
    this.p = 1;
  }

  private toOptionalNumber(value: number | string | null): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }
}
