import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CovidCategory } from '../home-http.service';

@Component({
  selector: 'app-case-stats',
  templateUrl: './case-stats.component.html',
  styleUrls: ['./case-stats.component.css']
})
export class CaseStatsComponent implements OnInit {
  @Input() covidCaseStat: CovidCategory;
  @Output() covidCaseChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onClickCovidCase() {
    const status = this.covidCaseStat?.status.toLowerCase()
    this.covidCaseChanged.emit(status);
  }

}
