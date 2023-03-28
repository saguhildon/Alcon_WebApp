import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDialogPopupComponent } from './dashboard-dialog-popup.component';

describe('DashboardDialogPopupComponent', () => {
  let component: DashboardDialogPopupComponent;
  let fixture: ComponentFixture<DashboardDialogPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardDialogPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDialogPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
