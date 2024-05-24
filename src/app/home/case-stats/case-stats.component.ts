import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CovidTabStat } from 'src/app/models/covid-tab-stat.model';

@Component({
  selector: 'app-case-stats',
  templateUrl: './case-stats.component.html',
  styleUrls: ['./case-stats.component.css']
})
export class CaseStatsComponent implements OnInit {
  @Input() covidCaseStat: CovidTabStat;
  @Input() activeTab?: string;
  @Output() covidCaseChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onClickCovidCase() {
    const status = this.covidCaseStat?.status.toLowerCase()
    this.covidCaseChanged.emit(status);
  }

  renderBackgroundColor() {
    if (this.covidCaseStat?.stateDetail) {
      if (this.activeTab === this.covidCaseStat?.status.toLowerCase()) {
        return this.covidCaseStat?.bgColor;
      }
      return;
    }
    return this.covidCaseStat?.bgColor
  }

}
