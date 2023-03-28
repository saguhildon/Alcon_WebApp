import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAlconComponent } from './dashboard-alcon.component';

describe('DashboardAlconComponent', () => {
  let component: DashboardAlconComponent;
  let fixture: ComponentFixture<DashboardAlconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAlconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAlconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
