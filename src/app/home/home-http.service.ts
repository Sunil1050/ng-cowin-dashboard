import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Subject } from 'rxjs';

type CovidStatus = 'Confirmed' | 'Deceased' | 'Recovered' | 'Tested';

interface CovidCaseData {
  Confirmed: number;
  Deceased: number;
  Recovered: number;
  Tested: number;
}

interface CovidCategory {
  imageUrl: string;
  status: CovidStatus;
  cases: number;
  color: string;
  bgColor: string;
}

@Injectable({
  providedIn: 'root',
})

export class HomeHttpService {
  covid19StateWise: any = {}; //Whole API response
  covid19StateWiseChanged = new Subject<any>(); //Subject to emit changed data
  covidCasesTotalData:CovidCaseData = {
    Confirmed: 0,
    Deceased: 0,
    Recovered: 0,
    Tested: 0,
  };
  covid19StatsCategories: CovidCategory[] = [
    {
      imageUrl:
        'https://res.cloudinary.com/djzj8lr4d/image/upload/v1716029792/check-mark_1check-mark_oqwbm5.png',
      status: 'Confirmed',
      cases: 0,
      color: "#FF073A",
      bgColor: "#331427"
    },
    {
      imageUrl:
        'https://res.cloudinary.com/djzj8lr4d/image/upload/v1716029791/protection_1protection_wdqdsx.png',
      status: 'Tested',
      cases: 0,
      color: "#007BFF",
      bgColor: "#132240"
    },
    {
      imageUrl:
        'https://res.cloudinary.com/djzj8lr4d/image/upload/v1716029791/Recovered_1Recovered_ggjnxp.png',
      status: 'Recovered',
      cases: 0,
      color: "#28A745",
      bgColor: "#182829"
    },
    {
      imageUrl:
        'https://res.cloudinary.com/djzj8lr4d/image/upload/v1716029792/breathing_1breathing_ext3vm.png',
      status: 'Deceased',
      cases: 0,
      color: "#6C757D",
      bgColor: "#212230"
    },
  ];

  constructor(private httpService: HttpService) {
    this.getHttpData();
  }

  getHttpData() {
    this.httpService.getCovid19StateWiseData().subscribe((response: any) => {
      this.covid19StateWise = response;
      this.covid19StateWiseChanged.next(this.covid19StateWise);
    });
  }

  getCovid19StateWiseData() {
    return this.covid19StateWise;
  }

  getTotalStatsOfNation(response: any) {
    const covidCasesTotalData: CovidCaseData = {
      Confirmed: 0,
      Deceased: 0,
      Recovered: 0,
      Tested: 0
    };
  
    const statesArr = Object.keys(response);
    statesArr.forEach((state) => {
      const stateData = response[state]['total'];
      if (stateData) {
        const { confirmed = 0, deceased = 0, recovered = 0, tested = 0 } = stateData;
        covidCasesTotalData.Confirmed += confirmed;
        covidCasesTotalData.Deceased += deceased;
        covidCasesTotalData.Recovered += recovered;
        covidCasesTotalData.Tested += tested;
      }
    });
  
    this.covid19StatsCategories = this.covid19StatsCategories.map((category) => {
      if (covidCasesTotalData.hasOwnProperty(category.status)) {
        return {
          ...category,
          cases: covidCasesTotalData[category.status as CovidStatus]
        };
      }
      return category;
    });
    return this.covid19StatsCategories;
  }
}
