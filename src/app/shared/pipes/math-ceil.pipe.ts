import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mathCeil',
  standalone: true,
})
export class MathCeilPipe implements PipeTransform {
  transform(value: number): number {
    return Math.ceil(value);
  }
}