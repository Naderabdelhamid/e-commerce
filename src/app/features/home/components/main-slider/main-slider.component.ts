import { Component, inject } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../../core/services/translation/translation.service';

@Component({
  selector: 'app-main-slider',
  imports: [CarouselModule, RouterLink],
  templateUrl: './main-slider.component.html',
  styleUrl: './main-slider.component.css',
})
export class MainSliderComponent {
  readonly transService = inject(TranslationService);

  mainOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    dots: true,
    items: 1,
    nav: false,
  };

  t(key: string): string {
    return this.transService.translate(key);
  }
}
