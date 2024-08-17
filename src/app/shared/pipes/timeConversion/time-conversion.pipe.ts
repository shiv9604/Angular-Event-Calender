import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeConversion'
})
export class TimeConversionPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const [hours, minutes] = value.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes>0 ? minutes.toString().padStart(2, '0') : minutes==0 ? '00' : '';
    return `${formattedHour}:${formattedMinutes} ${period}`;
  }

}
