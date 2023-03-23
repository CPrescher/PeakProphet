import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputControlComponent } from './output-control.component';

describe('OutputControlComponent', () => {
  let component: OutputControlComponent;
  let fixture: ComponentFixture<OutputControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputControlComponent ]
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