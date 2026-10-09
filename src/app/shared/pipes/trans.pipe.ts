import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation/translation.service';

@Pipe({
  name: 'trans',
  pure: false, // impure so it immediately re-evaluates when language changes
})
export class TransPipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  transform(key: string): string {
    return this.translationService.translate(key);
  }
}
