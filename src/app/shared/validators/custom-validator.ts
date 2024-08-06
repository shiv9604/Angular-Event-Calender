import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static endTimeValidator(control: AbstractControl): { [key: string]: any } | null {
    const startTime = control.root.get('startTime')?.value;
    const endTime = control.value;
    return CustomValidators.validate(startTime, endTime);
  }

  static startTimeValidator(control: AbstractControl): { [key: string]: any } | null {
    const startTime = control.value;
    const endTime = control.root.get('endTime')?.value;
    return CustomValidators.validate(startTime, endTime);
  }

  static validate(startTimeVal: string, endTimeVal: string) {
    if (!startTimeVal || !startTimeVal) {
      return null;
    }
    const [startHours, startMinutes] = startTimeVal.split(':').map(Number);
    const [endHours, endMinutes] = endTimeVal.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    if (endTotalMinutes <= startTotalMinutes) {
      return { invalidTime: true };
    }
    return null;
  }

  
}