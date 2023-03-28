import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BatchControlComponent} from './batch-control.component';
import {MaterialsModule} from "../../../shared/gui/materials.module";

describe('BatchControlComponent', () => {
  let component: BatchControlComponent;
  let fixture: ComponentFixture<BatchControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchControlComponent],
      imports: [MaterialsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BatchControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
