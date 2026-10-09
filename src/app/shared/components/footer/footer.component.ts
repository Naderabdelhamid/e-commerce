import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../../core/services/translation/translation.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly transService = inject(TranslationService);

  t(key: string): string {
    return this.transService.translate(key);
  }
}
