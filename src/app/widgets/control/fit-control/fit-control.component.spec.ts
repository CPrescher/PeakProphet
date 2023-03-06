import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitControlComponent } from './fit-control.component';

describe('FitControlComponent', () => {
  let component: FitControlComponent;
  let fixture: ComponentFixture<FitControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FitControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FitControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
