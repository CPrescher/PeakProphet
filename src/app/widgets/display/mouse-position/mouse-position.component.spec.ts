import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MousePositionComponent} from './mouse-position.component';
import {MatCardModule} from "@angular/material/card";
import {MousePositionService} from "../../../shared/mouse-position.service";

describe('MousePositionComponent', () => {
  let component: MousePositionComponent;
  let fixture: ComponentFixture<MousePositionComponent>;
  let mousePositionService: MousePositionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MousePositionComponent],
      imports: [MatCardModule]
    })
      .compileComponents();

    mousePositionService = TestBed.inject(MousePositionService);


    fixture = TestBed.createComponent(MousePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should show correct x and y mouse position values in template", () => {
    mousePositionService.updatePatternMousePosition(100, 200);
    fixture.detectChanges()
    const xElement = fixture.debugElement.nativeElement.querySelector('[data-test="x"]');
    const yElement = fixture.debugElement.nativeElement.querySelector('[data-test="y"]');
    expect(xElement.textContent).toContain("100");
    expect(yElement.textContent).toContain("200");
  });

  it("should show correct x and y mouse click values in template", () => {
    mousePositionService.updatePatternClickPosition(300, 500);
    fixture.detectChanges()
    const xElement = fixture.debugElement.nativeElement.querySelector('[data-test="x-click"]');
    const yElement = fixture.debugElement.nativeElement.querySelector('[data-test="y-click"]');
    expect(xElement.textContent).toContain("300");
    expect(yElement.textContent).toContain("500");
  });
});
