import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { NgApexchartsModule } from "ng-apexcharts";

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';

import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CaseStatsComponent } from './home/case-stats/case-stats.component';
import { FooterComponent } from './footer/footer.component';
import { LoaderComponent } from './loader/loader.component';
import { StateDetailComponent } from './home/state-detail/state-detail.component';
import { DistrictTabComponent } from './home/state-detail/district-tab/district-tab.component';
import { BarChartComponent } from './home/state-detail/bar-chart/bar-chart.component';
import { SpreadTrendsComponent } from './home/state-detail/spread-trends/spread-trends.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    CaseStatsComponent,
    FooterComponent,
    LoaderComponent,
    StateDetailComponent,
    DistrictTabComponent,
    BarChartComponent,
    SpreadTrendsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgApexchartsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatTableModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
