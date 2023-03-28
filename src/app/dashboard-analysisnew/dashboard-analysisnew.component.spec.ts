import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAnalysisnewComponent } from './dashboard-analysisnew.component';

describe('DashboardAnalysisnewComponent', () => {
  let component: DashboardAnalysisnewComponent;
  let fixture: ComponentFixture<DashboardAnalysisnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAnalysisnewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAnalysisnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
