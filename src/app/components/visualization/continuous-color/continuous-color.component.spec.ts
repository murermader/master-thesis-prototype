import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinuousColorComponent } from './continuous-color.component';

describe('ContinuousColorComponent', () => {
  let component: ContinuousColorComponent;
  let fixture: ComponentFixture<ContinuousColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContinuousColorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContinuousColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
