import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsCalenderComponent } from './appointments-calender.component';

describe('AppointmentsCalenderComponent', () => {
  let component: AppointmentsCalenderComponent;
  let fixture: ComponentFixture<AppointmentsCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsCalenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
