import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeGridComponent } from './time-grid.component';

describe('TimeGridComponent', () => {
  let component: TimeGridComponent;
  let fixture: ComponentFixture<TimeGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
