import { Component, OnInit, Input } from '@angular/core';
import { Chart, StockChart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';


declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-combined-pie-chart',
  templateUrl: './combined-pie-chart.component.html',
  styleUrls: ['./combined-pie-chart.component.scss']
})
export class CombinedPieChartComponent implements OnInit {

  /// The CombinedBarPieComponent will create a Chart from the given information.
  /// Title: An optional title for the chart.
  /// ValueType: An Optional String to give definition to the data values being represented.
  /// Datasource: A dataset being used for the chart.
  ///       - It is an array of objects, where each object has a name property and a data property.
  ///       - the Name property is what is used to represent the grouping of data.
  ///       - The Data property is a map of k->v pairs where each Key is a bar being represented in the chart.  The value is the associated numeric value.
  @Input() set valueType(val: string) {
    this._valueType = val;
    this.processSources();
  }
  get valueType() { return this._valueType; }

  @Input() set title(val: string) {
    this._title = val;
    this.processSources();
  }
  get title() { return this._title; }

  @Input() set datasource(val: any[]) {
    this._datasource = val || [];
    this.processSources();
  }
  get datasource() { return this._datasource; }


  constructor() { }
  private _valueType = '';
  private _title = '';
  private _datasource = [];

  // highcharts = Highcharts;

  chart: Chart = null;

  chartOptions = {
    chart: { type: 'bar'},
    title: {
      text: this.title || ''
    },
    yAxis: {
      title: {
        text: '',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      }
    },
    xAxis: {
      type: 'category',
      categories: [],
      min: 0,
      max: 5
    },
    scrollbar: {
      enabled: true
    },
    plotOptions: {
      column: {
        stacking: 'normal'
      },
      bar: {
        dataLabels: {
          enabled: true
        },
        events: {
          click: (e) => { alert('hi' + e); console.log('Info: ', e); }
        }
      }
    },
    series: [
      {
        // type: "bar",
        // name: "Column name",
        // data: []
      }, // .. as many as columns needed.
      // {
      // type: "pie",
      // name: "My Pie",
      // center: [100,80],
      // size: 100,
      // showInLegend: false,
      // dataLabels: { enabled: false },
      // data: [
      //   {
      //     name: "person 1.",
      //     y: 16
      // }, // Based on the number of number of columns.
      // ]
      // }
    ]
  };

  private _buildTimer = null;

  ngOnInit() {
    this.processSources();
  }

  buildChart(dataset: any[]) {
    /// This uses a timer as multiple items will call this function but if it was called too recently, it will just pretend the previous calls didnt happen.
    /// It does a "Most Recent Process fires event".
    /// It takes the hardcoded highcharts information for the chart type and changes all the required properties to rerender the screen.
    /// At the very end, after setting all elidgable properties, it will render the chart.

    if (this._buildTimer !== null) {
      clearTimeout(this._buildTimer);
      this._buildTimer = null;
    }

    this._buildTimer = setTimeout(() => {
      const opts = this.chartOptions;

      opts.title.text = this.title ? this.title[0].toUpperCase() + this.title.slice(1) : '';
      opts.yAxis.title.text = this.valueType ? this.valueType[0].toUpperCase() + this.valueType.slice(1) : '';

      opts.xAxis.categories = [];
      opts.series = [];

      const bars = new Set();
      dataset.forEach((item: { name: string, data: { total: number, subset: number } }) => {
        opts.xAxis.categories.push(item.name);
        Object.keys(item.data).forEach(col => bars.add(col));
      });

      const orderedBars = Array.from(bars).map((name: string) => ({
        type: 'bar',
        name,
        data: []
      }));
      
      // const orderedBars = [20, 20, 20, 20, 20].map( i => ({type: 'bar', name: `Test ${i}`, data: this.test(i)}));

      dataset.forEach((item: { name: string, data: { total: number, subset: number } }) => {
        orderedBars.forEach((value, idx, arr) => {
          arr[idx].data.push(item.data[value.name] || null);
        });
      });
      const sortFunc = (a: {name: string, data: {}}, b: {name: string, data: {}}) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      };
      opts.series = orderedBars.map(item => {
        item.name = item.name ? item.name[0].toUpperCase() + item.name.slice(1) : '';
        return item;
      }).filter( item => item.data.length > 0).sort( sortFunc );  /// TODO:  Follow up with this.  Not sure if i should filter out empties or not.

      opts.series.push({
        type: 'pie',
        name: 'Sum',
        center: ['80%', '20%'],
        size: 100,
        showInLegend: false,
        dataLabels: { enabled: true },
        data: orderedBars.map(item => ({ name: item.name ? item.name[0].toUpperCase() + item.name.slice(1) : '', y: item.data.reduce((total, num) => total + num) }))
      });

      if (this.chart) {
        console.log("CHART BEING DESTROYED")
        this.chart.destroy();
        
      }
      console.log("CHART BEING CREATED")
      this.chart = new Chart(opts as any);
    }, 200);
  }

  processSources() {
    this.buildChart(this.datasource);
  }

}
