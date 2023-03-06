import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseIndexComponent } from './browse-index.component';

describe('BrowseIndexComponent', () => {
  let component: BrowseIndexComponent;
  let fixture: ComponentFixture<BrowseIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
