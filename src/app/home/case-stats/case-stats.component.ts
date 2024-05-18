import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-stats',
  templateUrl: './case-stats.component.html',
  styleUrls: ['./case-stats.component.css']
})
export class CaseStatsComponent implements OnInit {
  @Input() covidCaseStat: any;
  constructor() { }

  ngOnInit(): void {
  }

}
