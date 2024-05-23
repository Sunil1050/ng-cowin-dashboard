import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { Delta } from 'src/app/models/delta.model';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
  @Input() barChartData: any[];

  constructor() {}

  // buildBarChartData() {
  //   // active - confirmed | tested | recovered | deceased
  //   return Object.keys(this.covid19TimelinesData[this.stateCode]?.dates).map(
  //     (date) => {
  //       return {
  //         'xAxisLabel': date,
  //         'yAxisLabel': this.covid19TimelinesData[this.stateCode]?.dates?.[date]
  //           ?.total?.[this.activeTab] as number,
  //         status: this.activeTab,
  //         color: this.getColorForActiveTab(),
  //       };
  //     }
  //   ).slice(0,10);
  // }

  // getColorForActiveTab() {
  //   switch (this.activeTab) {
  //     case 'confirmed':
  //       return '#FF073A';
  //     case 'tested':
  //       return '#007BFF';
  //     case 'recovered':
  //       return '#28A745';
  //     case 'deceased':
  //       return '#6C757D';
  //     default:
  //       return;
  //   }
  // }
}
