import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeakControlComponent } from './peak-control.component';

describe('PeakControlComponent', () => {
  let component: PeakControlComponent;
  let fixture: ComponentFixture<PeakControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeakControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeakControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
