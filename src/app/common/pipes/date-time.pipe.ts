import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'appDateTime',
  standalone: true,
})
export class DateTimePipe implements PipeTransform {
  transform(
    value: Date | string | number | null | undefined,
    format: string = 'dddd, MMMM D, YYYY'
  ): string {
    if (value === null || value === undefined || value === '') return '';

    const d = dayjs(value);
    if (!d.isValid()) return '';

    return d.format(format);
  }
}

