import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexTitleSubtitle,
  ApexGrid,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  // title: ApexTitleSubtitle;
  colors: any;
  grid: ApexGrid;
};

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() barChartData: any[];
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {}

  ngOnInit(): void {
    this._initChart(this.barChartData);
  }

  _initChart(chartData: any[]) {
    this.chartOptions = {
      series: [
        {
          name: chartData?.[0]?.status.toUpperCase() || 'Confirmed',
          data: chartData.map(
            (chartLabel) => chartLabel?.['yAxisLabel']
          ),
        },
      ],
      legend: {
        show: true,
        showForSingleSeries: true,
        fontSize: '18px',
        fontWeight: 500,
        offsetY: 10,
        labels: {
          colors: chartData.find((chart) => chart.hasOwnProperty('color'))?.color
        }
      },
      chart: {
        type: 'bar',
        height: 470,
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      colors: [
        chartData.find((chart) => chart.hasOwnProperty('color'))?.color,
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          colors: [
            chartData.find((chart) => chart.hasOwnProperty('color'))
              ?.color,
          ],
        },
        formatter: function (val: number) {
          if (val >= 10000000) {
            return (val / 10000000).toFixed(1) + 'Cr';
          } else if (val >= 1000000) {
            return (val / 1000000).toFixed(1) + 'M';
          } else if (val >= 100000) {
            return (val / 100000).toFixed(1) + 'L';
          } else if (val >= 1000) {
            return (val / 1000).toFixed(1) + 'K';
          }
          return val;
        },
      },
      xaxis: {
        type: 'datetime',
        categories: chartData.map(
          (chartLabel) => chartLabel?.['xAxisLabel']
        ),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          style: {
            colors: chartData.find((chart) =>
              chart.hasOwnProperty('color')
            )?.color,
            fontSize: '12px',
            fontWeight: '600',
          },
          datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy",
            day: 'dd MMM',
            hour: 'HH:mm',
          },
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['barChartData'] && !changes['barChartData'].firstChange) {
      this._initChart(changes['barChartData'].currentValue);
    }
  }
}
