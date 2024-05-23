import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CovidData } from './models/covid-state-wise-data.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {}

  getCovid19StateWiseData(): Observable<CovidData> {
    return this.http.get<CovidData>("https://apis.ccbp.in/covid19-state-wise-data")
  }

  getCovid19TimelinesData(stateCode: string): Observable<any> {
    return this.http.get(`https://apis.ccbp.in/covid19-timelines-data/${stateCode}`)
  }
}
