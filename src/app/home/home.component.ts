import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { State } from 'country-state-city';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HomeHttpService } from './home-http.service';

interface State {
  stateName: string;
  stateCode: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('searchContainer', { static: false }) searchContainer!: ElementRef;
  covid19HomePageData: any = {};
  covid19CategoriesTotalStats: any = {};
  dataSub: Subscription = new Subscription();
  displayedColumns: string[] = [
    'state',
    'confirmed',
    'active',
    'recovered',
    'deceased',
    'population',
  ];
  dataSource: any = [];
  searchControl = new FormControl();
  states: State[] = [];
  filteredStates!: Observable<State[]>;
  panelWidth!: string;
  isLoading: boolean = false;

  constructor(private homeHttpService: HomeHttpService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.homeHttpService.getHttpData();
    
    this.dataSub = this.homeHttpService.covid19StateWiseChanged.subscribe((response: any) => {
      this.isLoading = false;
      this.covid19HomePageData = response;
      this.covid19CategoriesTotalStats =
        this.homeHttpService.getTotalStatsOfNation(this.covid19HomePageData);
      this.dataSource = this.buildDataSource(this.covid19HomePageData);
      this.states = this.getAllStates(this.covid19HomePageData);
    });

    this.filteredStates = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  // ngAfterViewInit(): void {
  //   this.setPanelWidth();
  // }

  buildDataSource(data: any) {
    return Object.keys(data).map((state: string) => {
      const stateData = data[state];
      if (stateData) {
        const { confirmed, deceased, recovered, tested } = stateData['total'];
        const { population } = stateData['meta'];
        const stateName =
          State.getStateByCodeAndCountry(state, 'IN')?.name || 'Invalid State'; // Default country India
        return {
          state: stateName,
          confirmed,
          tested,
          recovered,
          deceased,
          population,
        };
      }
      return;
    });
  }

  getAllStates(data: any) {
    return Object.keys(data)
      .map((state) => {
        const isFound = State.getStatesOfCountry('IN').find(
          (s) => s.isoCode === state
        );
        if (isFound) {
          return {
            stateName: isFound.name,
            stateCode: isFound.isoCode,
          };
        }
        return {
          stateName: '',
          stateCode: '',
        };
      })
      .filter((state) => state.stateName !== '' && state.stateCode !== '') as {
      stateName: string;
      stateCode: string;
    }[];
  }

  // private setPanelWidth(): void {
  //   this.panelWidth = `${this.searchContainer.nativeElement.offsetWidth}px`;
  // }

  private _filter(value: string): State[] {
    const filterValue = value.toLowerCase().replace(/\s/g, '');
    return this.states.filter(
      (state) =>
        state.stateName.toLowerCase().includes(filterValue) ||
        state.stateCode.toLowerCase().includes(filterValue)
    );
  }

  ngOnDestroy(): void {
    this.dataSub.unsubscribe();
  }
}
