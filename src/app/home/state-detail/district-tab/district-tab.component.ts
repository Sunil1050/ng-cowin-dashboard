import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-district-tab',
  templateUrl: './district-tab.component.html',
  styleUrls: ['./district-tab.component.css']
})
export class DistrictTabComponent {
  @Input() districtStat: any;
  @Input() activeTab: string;

  constructor() { }
}
