import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditedPageComponent } from './edited-page.component';

describe('EditedPageComponent', () => {
  let component: EditedPageComponent;
  let fixture: ComponentFixture<EditedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditedPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
