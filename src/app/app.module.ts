import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CombinedPieChartComponent } from './components/combined-pie-chart/combined-pie-chart.component';

// These are imports required to get HighCharts working.
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as highstock from 'highcharts/modules/stock';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as highmaps from 'highcharts/modules/map.src';

@NgModule({
  declarations: [
    AppComponent,
    CombinedPieChartComponent,
  ],
  imports: [
    BrowserModule,
    ChartModule
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [highstock, more, exporting, highmaps]}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
