import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, exhaustMap, map, switchMap } from 'rxjs';
import { State } from 'country-state-city';

import { HttpService } from 'src/app/http.service';
import { HomeHttpService } from '../home-http.service';
import { CovidDistricts } from 'src/app/models/covid-districts.model';
import { ChartPlotData } from 'src/app/models/chart-data.model';

@Component({
  selector: 'app-state-detail',
  templateUrl: './state-detail.component.html',
  styleUrls: ['./state-detail.component.css'],
})
export class StateDetailComponent implements OnInit {
  stateCode: string;
  stateName: string;
  lastUpdated: string;
  totalTested: number = 0;
  arrowIconToggle: boolean = false;
  covid19CategoriesStateTotalStats: any = {};
  topDistrictsStats: any = [];
  activeTab: string = 'confirmed'; // confirmed | deceased | recovered | active
  activeTabDistrictStats: any[] = [];
  activeTabBarChartData: ChartPlotData[] = [];
  isLoading: boolean = false;
  covid19TimelinesData: any = {};
  covid19SpreadTrendsData: any[] = []; // {status: 'confirmed', data: [{}]}
  districtSortChange = new Subject<string>();

  constructor(
    private currentRoute: ActivatedRoute,
    private httpService: HttpService,
    private homeHttpService: HomeHttpService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    combineLatest([
      this.currentRoute.params,
      this.httpService.getCovid19StateWiseData(),
    ])
      .pipe(
        map(([params, covidData]) => {
          return { params, covidData };
        }),
        switchMap(({ params, covidData }) => {
          return this.httpService
            .getCovid19TimelinesData(params['stateCode'])
            .pipe(
              map((timelineData) => {
                return { params, covidData, timelineData };
              })
            );
        })
      )
      .subscribe(({ params, covidData, timelineData }) => {
        this.isLoading = false;
        this.stateCode = params['stateCode'];
        this.covid19TimelinesData = timelineData;

        // Default BarChart Data if no active Tab pressed !!
        this.activeTabBarChartData = this.getActiveTabBarChartData();
        this.covid19SpreadTrendsData = this.buildSpreadTrends();

        this.stateName = this.getStateName(this.stateCode);
        this.covid19CategoriesStateTotalStats =
          this.homeHttpService.getTotalStatsOfState(covidData, this.stateCode);

        const stateData = covidData[this.stateCode];
        if (stateData) {
          const lastUpdated = stateData.meta?.last_updated;
          if (lastUpdated) {
            this.lastUpdated = this.formatLastUpdate(lastUpdated);
          }
          this.totalTested = stateData?.total?.tested as number;
          this.topDistrictsStats = Object.keys(
            stateData?.districts as CovidDistricts
          ).map((disctrict) => {
            return {
              disctrictName: disctrict,
              confirmed:
                stateData?.districts?.[disctrict]?.total?.confirmed || 0,
              deceased: stateData?.districts?.[disctrict]?.total?.deceased || 0,
              recovered:
                stateData?.districts?.[disctrict]?.total?.recovered || 0,
              active: this.homeHttpService.getActiveCases(
                stateData?.districts?.[disctrict]?.total?.confirmed || 0,
                stateData?.districts?.[disctrict]?.total?.recovered || 0,
                stateData?.districts?.[disctrict]?.total?.deceased || 0
              ),
            };
          });

          // Default DistrictStats Data if no active Tab pressed !!
          this.activeTabDistrictStats = this.getActiveTabDistrictStats();
        }
      });

    // Sort change Subscription
    this.districtSortChange.subscribe((direction: string) => {
      this.activeTabDistrictStats = this.getActiveTabDistrictStats(direction);
    });
  }

  getActiveTab(status: string) {
    this.activeTab = status;
    this.activeTabDistrictStats = this.getActiveTabDistrictStats();
    this.activeTabBarChartData = this.getActiveTabBarChartData();
    this.arrowIconToggle = false;
  }

  private getStateName(stateCode: string): string {
    return (
      State.getStateByCodeAndCountry(stateCode, 'IN')?.name || 'Invalid State'
    );
  }

  private formatLastUpdate(timestamp: string) {
    const date = new Date(timestamp);
    return `${date.toLocaleString('default', {
      month: 'long',
    })} ${date.getDate()} ${date.getFullYear()}`;
  }

  private getActiveTabDistrictStats(sortDirection = 'desc') {
    const districtsStats = this.topDistrictsStats.map((district: any) => {
      if (district.hasOwnProperty(this.activeTab)) {
        return {
          districtName: district?.disctrictName,
          [this.activeTab]: district[this.activeTab],
        };
      }
      return;
    });
    if (sortDirection === 'asc') {
      return districtsStats.sort(
        (a: any, b: any) => a[this.activeTab] - b[this.activeTab]
      ); //Ascending order
    }
    return districtsStats.sort(
      (a: any, b: any) => b[this.activeTab] - a[this.activeTab]
    ); // Descending order
  }

  private getActiveTabBarChartData(): ChartPlotData[] {
    return Object.keys(this.covid19TimelinesData[this.stateCode]?.dates)
      .map((date) => {
        const obj = {
          xAxisLabel: date,
          status: this.activeTab,
          color: this.getColorForActiveTab(this.activeTab),
          yAxisLabel: 0,
        };
        if (this.activeTab === 'active') {
          const {
            confirmed = 0,
            deceased = 0,
            recovered = 0,
          } = this.covid19TimelinesData[this.stateCode]?.dates?.[date]?.total;
          obj['yAxisLabel'] = this.homeHttpService.getActiveCases(
            confirmed,
            recovered,
            deceased
          );
        } else {
          obj['yAxisLabel'] = this.covid19TimelinesData[this.stateCode]
            ?.dates?.[date]?.total?.[this.activeTab] as number;
        }
        return obj;
      })
      .slice(0, 10);
  }

  private buildSpreadTrends(): ChartPlotData[] {
    const result: ChartPlotData[] = [];
    let casesCategories = ['confirmed', 'tested', 'recovered', 'deceased'];
    Object.keys(this.covid19TimelinesData[this.stateCode]?.dates).forEach(
      (date) => {
        casesCategories.forEach((category: string) => {
          result.push({
            status: category,
            xAxisLabel: date,
            yAxisLabel: this.covid19TimelinesData[this.stateCode]?.dates?.[date]
              ?.total?.[category] as number,
            color: this.getColorForActiveTab(category),
          });
        });
      }
    );
    return result;
  }

  private getColorForActiveTab(activeTab: string) {
    switch (activeTab) {
      case 'confirmed':
        return '#FF073A';
      case 'active':
        return '#007BFF';
      case 'recovered':
        return '#28A745';
      case 'deceased':
        return '#6C757D';
      default:
        return;
    }
  }

  getTopDistrictsBadgeColor() {
    switch (this.activeTab) {
      case 'confirmed':
        return '#FF073A';
      case 'deceased':
        return '#6C757D';
      case 'recovered':
        return '#28A745';
      case 'tested':
        return '#007BFF';
      default:
        return '#fff';
    }
  }

  toggleArrowIcon() {
    this.arrowIconToggle = !this.arrowIconToggle;
    const direction = this.arrowIconToggle ? 'asc' : 'desc';
    this.districtSortChange.next(direction);
  }
}
