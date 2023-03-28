import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDialogAnalysisComponent } from './dashboard-dialog-analysis.component';

describe('DashboardDialogAnalysisComponent', () => {
  let component: DashboardDialogAnalysisComponent;
  let fixture: ComponentFixture<DashboardDialogAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDialogAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDialogAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
