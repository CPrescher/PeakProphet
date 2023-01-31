import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeakItemComponent } from './peak-item.component';

describe('PeakComponent', () => {
  let component: PeakItemComponent;
  let fixture: ComponentFixture<PeakItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeakItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeakItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
