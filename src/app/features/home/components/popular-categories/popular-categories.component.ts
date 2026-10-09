import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { Category } from '../../../../core/models/category.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../../core/services/translation/translation.service';

@Component({
  selector: 'app-popular-categories',
  imports: [CarouselModule, RouterLink],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css',
})
export class PopularCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  readonly transService = inject(TranslationService);

  categoriesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 3000,
    dots: false,
    margin: 16,
    navSpeed: 700,
    responsive: {
      0: { items: 2 },
      540: { items: 3 },
      768: { items: 4 },
      1024: { items: 6 },
    },
    nav: false,
  };

  categoriserList: Category[] = [];

  ngOnInit(): void {
    this.getAllCategoriesData();
  }

  t(key: string): string {
    return this.transService.translate(key);
  }

  getAllCategoriesData(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriserList = res.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
