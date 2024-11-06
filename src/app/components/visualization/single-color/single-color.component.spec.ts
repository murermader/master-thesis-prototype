import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleColorComponent } from './single-color.component';

describe('SingleColorVisualizationConfigurationComponent', () => {
  let component: SingleColorComponent;
  let fixture: ComponentFixture<SingleColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleColorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
