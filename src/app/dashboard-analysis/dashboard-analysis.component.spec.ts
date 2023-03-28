import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAnalysisComponent } from './dashboard-analysis.component';

describe('DashboardAnalysisComponent', () => {
  let component: DashboardAnalysisComponent;
  let fixture: ComponentFixture<DashboardAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
