import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternControlComponent } from './pattern-control.component';

describe('PatternControlComponent', () => {
  let component: PatternControlComponent;
  let fixture: ComponentFixture<PatternControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
