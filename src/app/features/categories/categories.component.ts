import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { Category, SubCategory } from '../../core/models/category.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);

  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string>('');

  readonly selectedCategory = signal<Category | null>(null);
  readonly subcategories = signal<SubCategory[]>([]);
  readonly isLoadingSubcategories = signal<boolean>(false);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.categoriesService.getAllCategories(30, 1).subscribe({
      next: (res) => {
        this.categories.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(
          err.error?.message || 'Failed to load categories.'
        );
        this.isLoading.set(false);
      },
    });
  }

  selectCategory(category: Category): void {
    this.selectedCategory.set(category);
    this.isLoadingSubcategories.set(true);
    this.subcategories.set([]);

    this.categoriesService
      .getSubcategoriesOfCategory(category._id)
      .subscribe({
        next: (res) => {
          this.subcategories.set(res.data || []);
          this.isLoadingSubcategories.set(false);
        },
        error: () => {
          this.isLoadingSubcategories.set(false);
        },
      });
  }

  closeSubcategories(): void {
    this.selectedCategory.set(null);
    this.subcategories.set([]);
  }

  navigateToCategoryProducts(categoryId: string): void {
    this.router.navigate(['/products'], {
      queryParams: { category: categoryId },
    });
  }
}
