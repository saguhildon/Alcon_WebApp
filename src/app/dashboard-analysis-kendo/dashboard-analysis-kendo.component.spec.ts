import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAnalysisKendoComponent } from './dashboard-analysis-kendo.component';

describe('DashboardAnalysisKendoComponent', () => {
  let component: DashboardAnalysisKendoComponent;
  let fixture: ComponentFixture<DashboardAnalysisKendoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAnalysisKendoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAnalysisKendoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
