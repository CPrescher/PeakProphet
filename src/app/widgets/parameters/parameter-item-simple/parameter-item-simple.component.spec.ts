import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterItemSimpleComponent } from './parameter-item-simple.component';
import {AppModule} from "../../../app.module";

describe('ParameterItemSimpleComponent', () => {
  let component: ParameterItemSimpleComponent;
  let fixture: ComponentFixture<ParameterItemSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ ParameterItemSimpleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterItemSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
