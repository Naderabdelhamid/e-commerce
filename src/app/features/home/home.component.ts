import { Component, inject } from '@angular/core';
import { MainSliderComponent } from './components/main-slider/main-slider.component';
import { PopularCategoriesComponent } from './components/popular-categories/popular-categories.component';
import { PopularProductsComponent } from './components/popular-products/popular-products.component';
import { TranslationService } from '../../core/services/translation/translation.service';

@Component({
  selector: 'app-home',
  imports: [
    MainSliderComponent,
    PopularCategoriesComponent,
    PopularProductsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly transService = inject(TranslationService);

  t(key: string): string {
    return this.transService.translate(key);
  }
}
