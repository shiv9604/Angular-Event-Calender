import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';

export class CustomValidators {
  static endTimeValidator(control: AbstractControl): { [key: string]: any } | null {
    const startTime = control.root.get('startTime')?.value;
    const endTime = control.value;
    if (!startTime || !endTime) {
      return null;
    }
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    if (endTotalMinutes <= startTotalMinutes) {
      return { invalid: true };
    }
    return null;
  }
}