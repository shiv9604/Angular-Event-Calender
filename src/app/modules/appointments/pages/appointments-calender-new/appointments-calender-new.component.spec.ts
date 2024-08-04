import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsCalenderNewComponent } from './appointments-calender-new.component';

describe('AppointmentsCalenderNewComponent', () => {
  let component: AppointmentsCalenderNewComponent;
  let fixture: ComponentFixture<AppointmentsCalenderNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsCalenderNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsCalenderNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
