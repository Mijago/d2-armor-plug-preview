import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlugStatisticsOverviewComponent } from './plug-statistics-overview.component';

describe('PlugStatisticsOverviewComponent', () => {
  let component: PlugStatisticsOverviewComponent;
  let fixture: ComponentFixture<PlugStatisticsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlugStatisticsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlugStatisticsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
