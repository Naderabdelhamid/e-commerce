import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'term',
})
export class TermPipe implements PipeTransform {
  transform(vale: string, count: number): string {
    return vale.split(' ', count).join(' ');
  }
}
