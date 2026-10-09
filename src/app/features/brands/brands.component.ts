import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BrandsService } from '../../core/services/brands/brands.service';
import { Brand } from '../../core/models/brand.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TransPipe } from '../../shared/pipes/trans.pipe';

@Component({
  selector: 'app-brands',
  imports: [CommonModule, FormsModule, TransPipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);
  private readonly router = inject(Router);

  readonly brands = signal<Brand[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string>('');
  readonly searchTerm = signal<string>('');
  readonly selectedBrand = signal<Brand | null>(null);

  readonly filteredBrands = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.brands();
    return this.brands().filter((b) => b.name.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.brandsService.getAllBrands(40, 1).subscribe({
      next: (res) => {
        this.brands.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to load brands.');
        this.isLoading.set(false);
      },
    });
  }

  openBrandDetails(brand: Brand): void {
    this.selectedBrand.set(brand);
  }

  closeBrandModal(): void {
    this.selectedBrand.set(null);
  }

  viewBrandProducts(brandId: string): void {
    this.closeBrandModal();
    this.router.navigate(['/products'], {
      queryParams: { brand: brandId },
    });
  }
}
