import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlugCombinationVisualiserComponent } from './plug-combination-visualiser.component';

describe('PlugCombinationVisualiserComponent', () => {
  let component: PlugCombinationVisualiserComponent;
  let fixture: ComponentFixture<PlugCombinationVisualiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlugCombinationVisualiserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlugCombinationVisualiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
