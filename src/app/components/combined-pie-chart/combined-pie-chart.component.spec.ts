import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedPieChartComponent } from './combined-pie-chart.component';

describe('CombinedPieChartComponent', () => {
  let component: CombinedPieChartComponent;
  let fixture: ComponentFixture<CombinedPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinedPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
