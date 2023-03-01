import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FitControlComponent} from './fit-control.component';
import {MaterialsModule} from "../../shared/gui/materials.module";
import {BrowseIndexComponent} from "../browse-index/browse-index.component";

describe('PatternControlComponent', () => {
  let component: FitControlComponent;
  let fixture: ComponentFixture<FitControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FitControlComponent, BrowseIndexComponent],
      imports: [MaterialsModule]
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
