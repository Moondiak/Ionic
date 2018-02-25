import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertCts'
})
export class ConvertCtsPipe implements PipeTransform {
  transform(value: number) {
    return `${value / 100} €` ;
  }
}
