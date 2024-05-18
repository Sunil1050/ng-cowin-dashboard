import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {}

  getCovid19StateWiseData() {
    return this.http.get("https://apis.ccbp.in/covid19-state-wise-data")
  }
}
