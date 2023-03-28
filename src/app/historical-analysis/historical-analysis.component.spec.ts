import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalAnalysisComponent } from './historical-analysis.component';

describe('HistoricalAnalysisComponent', () => {
  let component: HistoricalAnalysisComponent;
  let fixture: ComponentFixture<HistoricalAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
