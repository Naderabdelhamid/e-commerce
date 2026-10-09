import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onSale',
})
export class OnSalePipe implements PipeTransform {
  transform(vale: string): string {
    return 'on Sale - ' + vale;
  }
}
