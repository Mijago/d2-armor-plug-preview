import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlugTripletVisualiserComponent } from './plug-triplet-visualiser.component';

describe('PlugTripletVisualiserComponent', () => {
  let component: PlugTripletVisualiserComponent;
  let fixture: ComponentFixture<PlugTripletVisualiserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlugTripletVisualiserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlugTripletVisualiserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
