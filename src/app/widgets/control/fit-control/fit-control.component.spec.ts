import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FitControlComponent} from './fit-control.component';
import {MaterialsModule} from "../../../shared/gui/materials.module";
import {provideMockStore} from "@ngrx/store/testing";

describe('FitControlComponent', () => {
  let component: FitControlComponent;
  let fixture: ComponentFixture<FitControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FitControlComponent],
      imports: [MaterialsModule],
      providers: [
        provideMockStore({})
      ]
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
