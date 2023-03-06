import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BkgControlComponent} from './bkg-control.component';
import {BkgService} from "../../../shared/bkg.service";
import {QuadraticModel} from "../../../shared/models/bkg/quadratic.model";
import {MaterialsModule} from "../../../shared/gui/materials.module";

describe('BkgControlComponent', () => {
  let component: BkgControlComponent;
  let fixture: ComponentFixture<BkgControlComponent>;
  let bkgService: BkgService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BkgControlComponent],
      imports: [MaterialsModule],
    })
      .compileComponents();

    bkgService = TestBed.inject(BkgService);


    fixture = TestBed.createComponent(BkgControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a bkgTypes property', () => {
    expect(component.bkgTypes).toBeTruthy();
  });

  it("should show correct bkg type upon setting bkg model", () => {
    const bkgModel = new QuadraticModel();
    bkgService.setBkgModel(bkgModel);
    expect(component.selectedBkgType).toBe("quadratic");
  });
});
