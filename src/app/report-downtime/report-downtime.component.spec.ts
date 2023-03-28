import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDowntimeComponent } from './report-downtime.component';

describe('ReportDowntimeComponent', () => {
  let component: ReportDowntimeComponent;
  let fixture: ComponentFixture<ReportDowntimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDowntimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
