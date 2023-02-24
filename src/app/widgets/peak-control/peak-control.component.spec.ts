import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PeakControlComponent} from './peak-control.component';
import {AppModule} from "../../app.module";

describe('PeakControlComponent', () => {
  let component: PeakControlComponent;
  let fixture: ComponentFixture<PeakControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
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
