import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitControlComponent } from './fit-control.component';
import {MatCardModule} from "@angular/material/card";

describe('FitControlComponent', () => {
  let component: FitControlComponent;
  let fixture: ComponentFixture<FitControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FitControlComponent ],
      imports: [MatCardModule]
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
