import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OutputControlComponent} from './output-control.component';
import {MaterialsModule} from "../../../shared/gui/materials.module";
import {provideMockStore} from "@ngrx/store/testing";

describe('OutputControlComponent', () => {
  let component: OutputControlComponent;
  let fixture: ComponentFixture<OutputControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutputControlComponent],
      imports: [MaterialsModule],
      providers: [
        provideMockStore({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OutputControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
