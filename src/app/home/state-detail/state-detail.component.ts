import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, combineLatest, exhaustMap, map, switchMap } from 'rxjs';
import { State } from 'country-state-city';

import { HttpService } from 'src/app/http.service';
import { HomeHttpService } from '../home-http.service';
import { CovidDistricts } from 'src/app/models/covid-districts.model';
import { ChartPlotData } from 'src/app/models/chart-data.model';
import { CovidTabStat } from 'src/app/models/covid-tab-stat.model';

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
  population: number = 0;
  arrowIconToggle: boolean = false;
  covid19CategoriesStateTotalStats: CovidTabStat[] = [];
  topDistrictsStats: any[] = [];
  activeTab: string = 'confirmed'; // confirmed | deceased | recovered | active
  activeTabDistrictStats: any[] = [];
  activeTabBarChartData: ChartPlotData[] = [];
  isLoading: boolean = false;
  covid19TimelinesData: any = {};
  covid19SpreadTrendsData: any[] = [];
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
        map(([params, Covid19StateWiseData]) => {
          return { params, Covid19StateWiseData };
        }),
        switchMap(({ params, Covid19StateWiseData }) => {
          return this.httpService
            .getCovid19TimelinesData(params['stateCode'])
            .pipe(
              map((timelineData) => {
                return { params, Covid19StateWiseData, timelineData };
              })
            );
        })
      )
      .subscribe(({ params, Covid19StateWiseData, timelineData }) => {
        this.isLoading = false;
        this.stateCode = params['stateCode'];
        this.covid19TimelinesData = timelineData;

        // Default BarChart Data if no active Tab pressed !!
        this.activeTabBarChartData = this.getActiveTabBarChartData();
        this.covid19SpreadTrendsData = this.buildSpreadTrends();

        this.stateName = this.getStateName(this.stateCode);
        this.covid19CategoriesStateTotalStats =
          this.homeHttpService.getTotalStatsOfState(
            Covid19StateWiseData,
            this.stateCode
          );

        const stateData = Covid19StateWiseData[this.stateCode];
        if (stateData) {
          const lastUpdated = stateData.meta?.last_updated;
          if (lastUpdated) {
            this.lastUpdated = this.formatLastUpdate(lastUpdated);
          }
          this.totalTested = stateData?.total?.tested as number;
          this.population = stateData?.meta?.population as number;
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

  private buildSpreadTrends() {
    let casesCategories = ['confirmed', 'active', 'recovered', 'deceased'];
    return casesCategories.map((category) => {
      return {
        status: category,
        color: this.getColorForActiveTab(category),
        bgColor: this.getBgColorForActiveTab(category),
        data: this.buildChartDataForSpreadTrends(category),
      };
    });
  }

  private buildChartDataForSpreadTrends(category: string) {
    return Object.keys(this.covid19TimelinesData[this.stateCode]?.dates).map(
      (date: string) => {
        const obj = {
          xAxisLabel: date,
          yAxisLabel: 0,
        };
        if (category === 'active') {
          const {
            confirmed = 0,
            recovered = 0,
            deceased = 0,
          } = this.covid19TimelinesData[this.stateCode]?.dates?.[date]?.total;
          obj['yAxisLabel'] = this.homeHttpService.getActiveCases(
            confirmed,
            recovered,
            deceased
          );
        } else {
          obj['yAxisLabel'] = this.covid19TimelinesData[this.stateCode]
            ?.dates?.[date]?.total?.[category] as number;
        }
        return obj;
      }
    );
  }

  getColorForActiveTab(activeTab: string) {
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

  private getBgColorForActiveTab(activeTab: string) {
    switch (activeTab) {
      case 'confirmed':
        return '#331427';
      case 'active':
        return '#132240';
      case 'recovered':
        return '#182829';
      case 'deceased':
        return '#1C1C2B';
      default:
        return;
    }
  }

  toggleArrowIcon() {
    this.arrowIconToggle = !this.arrowIconToggle;
    const direction = this.arrowIconToggle ? 'asc' : 'desc';
    this.districtSortChange.next(direction);
  }

  getMapImage(stateCode: string) {
    switch(stateCode) {
      case 'AN':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566618/Group_7362andaman_k2nlgc.png"
      case 'AP':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716567194/Group_7354andhra_pradesh_tcidw9.png"
      case 'AR':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566618/Group_7340arunachal_pradesh_t6e6v2.png"
      case 'AS':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566617/Group_7341assam_m51smg.png"
      case 'BR':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566620/Group_7335Bihar_iats8c.png"
      case 'CH':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566618/Group_7361chandigarh_fabayl.png"
      case 'CT':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566621/Group_7353chattisgarh_wxjkjh.png"
      case 'DL':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566618/Group_7358delhi_kioyn8.png"
      case 'DN':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566617/Group_7357dama_and_diu_rqhr1c.png"
      case 'GA':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566617/Group_7349goa_rkuvfd.png"
      case 'GJ':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566619/Group_7337Gujurat_kvwl0j.png"
      case 'HP':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566622/Group_7364himachal_pradesh_rucmlj.png"
      case 'HR':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566621/Group_7332Haryana_kwlhcs.png"
      case 'JH':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566619/Group_7342jharkhand_dbulxk.png"
      case 'JK':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566623/Group_7328JK_ehhdja.png"
      case 'KA':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566620/Group_7339karnataka_jpsx90.png"
      case 'KL':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566620/Group_7355kerala_dcbzi5.png"
      case 'LA':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566617/Group_7363ladakh_edyqas.png"
      case 'LD':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566617/Group_7359lakshwadeep_bqwqyx.png"
      case 'MH':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566620/Group_7350maharastra_tf9o3m.png"
      case 'ML':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566617/Group_7344meghalaya_mlir1k.png"
      case 'MN':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566622/Group_7346manipur_q5oa90.png"
      case 'MP':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566620/Group_7336madya_pradesh_kmxtae.png"
      case "MZ":
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566622/Group_7347mizoram_ivrflc.png"
      case 'NL':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566622/Group_7345nagaland_fsbza2.png"
      case 'OR':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566620/Group_7348orrisa_ntn7gc.png"
      case 'PB':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566622/Group_7330punjab_iruwsz.png"
      case 'PY':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566618/Group_7360puducherry_p8l4yi.png"
      case 'RJ':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566621/Group_7333Rajasthan_x2do8x.png"
      case 'SK':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566618/Group_7338sikkim_zbscyt.png"
      case 'TG':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566621/Group_7351telengana_blan34.png"
      case 'TN':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566619/Group_7356tamil_nadu_j9a1r5.png"
      case 'TR':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566622/Group_7352tripura_wwaddr.png"
      case 'TT':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566619/Group_7326india_jt8sln.png"
      case "UP":
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566621/Group_7334uttar_pradesh_eycmed.png"
      case 'UT':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566622/Group_7331uttarakhand_r2a4ok.png"
      case 'WB':
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566619/Group_7343west_bengal_hprbmh.png"
      default:
        return "https://res.cloudinary.com/djzj8lr4d/image/upload/v1716566619/Group_7326india_jt8sln.png"
    }
  }
}
