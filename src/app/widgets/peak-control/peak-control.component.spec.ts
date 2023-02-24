import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PeakControlComponent} from './peak-control.component';
import {MaterialsModule} from "../../shared/gui/materials.module";

describe('PeakControlComponent', () => {
  let component: PeakControlComponent;
  let fixture: ComponentFixture<PeakControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsModule],
      declarations: [PeakControlComponent]
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
