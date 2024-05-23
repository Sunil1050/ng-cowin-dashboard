import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable, Subject } from 'rxjs';
import { Covid19StateWiseData } from '../models/covid-state-wise-data.model';
import { CovidTabStat, CovidStatus } from '../models/covid-tab-stat.model';

interface CovidCaseData {
  Confirmed: number;
  Deceased: number;
  Recovered: number;
  Active: number;
}

@Injectable({
  providedIn: 'root',
})
export class HomeHttpService {
  covid19StateWise: Covid19StateWiseData = {}; //Whole API response
  covid19StateWiseChanged = new Subject<Covid19StateWiseData>(); //Subject to emit changed data
  covidCasesTotalData: CovidCaseData = {
    Confirmed: 0,
    Deceased: 0,
    Recovered: 0,
    Active: 0,
  };
  covid19StatsCategories: CovidTabStat[] = [
    {
      imageUrl:
        'https://res.cloudinary.com/djzj8lr4d/image/upload/v1716029792/check-mark_1check-mark_oqwbm5.png',
      status: 'Confirmed',
      cases: 0,
      color: '#FF073A',
      bgColor: '#331427',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/djzj8lr4d/image/upload/v1716029791/protection_1protection_wdqdsx.png',
      status: 'Active',
      cases: 0,
      color: '#007BFF',
      bgColor: '#132240',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/djzj8lr4d/image/upload/v1716029791/Recovered_1Recovered_ggjnxp.png',
      status: 'Recovered',
      cases: 0,
      color: '#28A745',
      bgColor: '#182829',
    },
    {
      imageUrl:
        'https://res.cloudinary.com/djzj8lr4d/image/upload/v1716029792/breathing_1breathing_ext3vm.png',
      status: 'Deceased',
      cases: 0,
      color: '#6C757D',
      bgColor: '#212230',
    },
  ];

  constructor(private httpService: HttpService) {
    this.getHttpData();
  }

  getHttpData()  {
    this.httpService.getCovid19StateWiseData().subscribe((response: any) => {
      this.covid19StateWise = response;
      this.covid19StateWiseChanged.next(this.covid19StateWise);
    });
  }

  getCovid19StateWiseData(): Covid19StateWiseData {
    return this.covid19StateWise;
  }

  getTotalStatsOfNation(response: Covid19StateWiseData): CovidTabStat[] {
    const covidCasesTotalData: CovidCaseData = {
      Confirmed: 0,
      Deceased: 0,
      Recovered: 0,
      Active: 0,
    };

    const statesArr = Object.keys(response);
    statesArr.forEach((state) => {
      const stateData = response[state]['total'];
      if (stateData) {
        const { confirmed = 0, deceased = 0, recovered = 0 } = stateData;
        const activeCases = this.getActiveCases(confirmed, recovered, deceased);

        covidCasesTotalData.Confirmed += confirmed;
        covidCasesTotalData.Deceased += deceased;
        covidCasesTotalData.Recovered += recovered;
        covidCasesTotalData.Active += activeCases;
      }
    });

    this.covid19StatsCategories = this.covid19StatsCategories.map(
      (category) => {
        if (covidCasesTotalData.hasOwnProperty(category.status)) {
          return {
            ...category,
            cases: covidCasesTotalData[category.status as CovidStatus],
          };
        }
        return category;
      }
    );
    return this.covid19StatsCategories;
  }

  getTotalStatsOfState(response: Covid19StateWiseData, stateCode: string): CovidTabStat[] {
    const covidCasesTotalData: CovidCaseData = {
      Confirmed: 0,
      Deceased: 0,
      Recovered: 0,
      Active: 0,
    };
    const stateData = response[stateCode]['total'];
    if (stateData) {
      const {
        confirmed = 0,
        deceased = 0,
        recovered = 0,
      } = stateData;
      const activeCases = this.getActiveCases(confirmed, recovered, deceased);

      covidCasesTotalData.Confirmed += confirmed;
      covidCasesTotalData.Deceased += deceased;
      covidCasesTotalData.Recovered += recovered;
      covidCasesTotalData.Active += activeCases;
    }
    this.covid19StatsCategories = this.covid19StatsCategories.map(
      (category) => {
        if (covidCasesTotalData.hasOwnProperty(category.status)) {
          return {
            ...category,
            cases: covidCasesTotalData[category.status as CovidStatus],
          };
        }
        return category;
      }
    );
    return this.covid19StatsCategories;
  }

  getActiveCases(
    confirmedCases: number,
    recoveredCases: number,
    deceasedCases: number
  ): number {
    return confirmedCases - (recoveredCases + deceasedCases);
  }
}
