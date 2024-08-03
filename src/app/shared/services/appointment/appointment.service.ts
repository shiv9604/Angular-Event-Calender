import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private selectedDateSub = new Subject<Date>();
  selectedDate$: Observable<Date>;
  constructor() { 
    this.selectedDate$ = this.selectedDateSub.asObservable();
  }

  public updateSelectedDate(date: Date) { 
    this.selectedDateSub.next(date);
  }
}
