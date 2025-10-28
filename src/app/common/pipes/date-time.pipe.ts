import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

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

    const m = moment(value as any);
    if (!m.isValid()) return '';

    return m.format(format);
  }
}
