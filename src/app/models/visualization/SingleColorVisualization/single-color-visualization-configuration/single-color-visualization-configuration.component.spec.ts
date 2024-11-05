import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleColorVisualizationConfigurationComponent } from './single-color-visualization-configuration.component';

describe('SingleColorVisualizationConfigurationComponent', () => {
  let component: SingleColorVisualizationConfigurationComponent;
  let fixture: ComponentFixture<SingleColorVisualizationConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleColorVisualizationConfigurationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleColorVisualizationConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
