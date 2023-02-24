import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PeakItemComponent} from './peak-item.component';
import {MaterialsModule} from "../../shared/gui/materials.module";
import {ParameterItemSimpleComponent} from "../parameters/parameter-item-simple/parameter-item-simple.component";

describe('PeakItemComponent', () => {
  let component: PeakItemComponent;
  let fixture: ComponentFixture<PeakItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsModule],
      declarations: [PeakItemComponent, ParameterItemSimpleComponent]
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
