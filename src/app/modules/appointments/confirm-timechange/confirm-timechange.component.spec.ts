import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTimechangeComponent } from './confirm-timechange.component';

describe('ConfirmTimechangeComponent', () => {
  let component: ConfirmTimechangeComponent;
  let fixture: ComponentFixture<ConfirmTimechangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmTimechangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmTimechangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
