import { Component, Input, OnInit, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexMarkers,
  ApexLegend,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  markers: ApexMarkers;
  legend: ApexLegend;
  colors: any;
};

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  @Input() spreadTrendChartData: any;   // color, bgColor, status, data: {xAxisLabel, yAxisLabel}
  public chartOptions: Partial<ChartOptions>;

  constructor() {}

  ngOnInit(): void {
    this._initChart();
  }

  _initChart() {
    this.chartOptions = {
      series: [
        {
          name: this.spreadTrendChartData?.status.toUpperCase(),
          data: this.spreadTrendChartData?.data.map((y: any) => y?.yAxisLabel)
        },
      ],
      markers: {
        size: 3,
      },
      title: {
        text: this.spreadTrendChartData?.status.charAt(0).toUpperCase() + this.spreadTrendChartData?.status.slice(1).toLowerCase(),
        align: 'right',
        offsetY: 26,
        style: {
          color: this.spreadTrendChartData?.color,
          fontSize:  '14px',
          fontWeight:  'bold',
          fontFamily:  "Roboto",
        }
      },
      colors: [this.spreadTrendChartData?.color],
      chart: {
        height: 350,
        type: 'line',
        background: this.spreadTrendChartData?.bgColor,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        show: false,
        padding: {
          top: 20,
          right: 40,
          bottom: 10,
          left: 20,
        },
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        fontSize: '16px',
        fontWeight: 500,
        labels: {
          colors: this.spreadTrendChartData?.color,
        },
      },
      xaxis: {
        type: 'datetime',
        categories: this.spreadTrendChartData.data.map((x: any) => x?.xAxisLabel),
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        labels: {
          show: true,
          style: {
            colors: this.spreadTrendChartData?.color,
            fontSize: '12px',
            fontWeight: '600',
          },
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMM \'yy',
            day: 'dd MMM',
            hour: 'HH:mm'
          }
        },
      },
      yaxis: {
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        labels: {
          show: true,
          style: {
            colors: this.spreadTrendChartData?.color,
            fontSize: '12px',
            fontWeight: '600',
          },
          formatter: function (val) {
            if (val >= 10000000) {
              return (val / 10000000).toFixed(1) + 'Cr';
            } else if (val >= 1000000) {
              return (val / 1000000).toFixed(1) + 'M';
            } else if (val >= 100000) {
              return (val / 100000).toFixed(1) + 'L';
            } else if (val >= 1000) {
              return (val / 1000).toFixed(1) + 'K';
            }
            return val.toString();
          },
        },
      },
    };
  }
}
