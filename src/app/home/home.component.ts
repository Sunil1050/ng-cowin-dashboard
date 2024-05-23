import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { State } from 'country-state-city';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { HomeHttpService } from './home-http.service';
import { Router } from '@angular/router';

interface State {
  stateName: string;
  stateCode: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchContainer', { static: false }) searchContainer!: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

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
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  searchControl = new FormControl();
  states: State[] = [];
  filteredStates!: Observable<State[]>;
  panelWidth!: string;
  isLoading: boolean = false;

  constructor(
    private homeHttpService: HomeHttpService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.homeHttpService.getHttpData();

    this.dataSub = this.homeHttpService.covid19StateWiseChanged.subscribe(
      (response: any) => {
        this.isLoading = false;
        this.covid19HomePageData = response;
        this.covid19CategoriesTotalStats =
          this.homeHttpService.getTotalStatsOfNation(this.covid19HomePageData);
        this.dataSource.data = this.buildDataSource(this.covid19HomePageData);
        this.states = this.getAllStates(this.covid19HomePageData);
        this.dataSource.sort = this.sort; // Set sort after data source is initialized
      }
    );

    this.filteredStates = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  buildDataSource(data: any) {
    return Object.keys(data).map((state: string) => {
      const stateData = data[state];
      if (stateData) {
        const { confirmed, deceased, recovered } = stateData['total'];
        const activeCases = this.homeHttpService.getActiveCases(confirmed, recovered, deceased);
        const { population } = stateData['meta'];

        const stateName =
          State.getStateByCodeAndCountry(state, 'IN')?.name || 'Invalid State'; // Default country India
        return {
          state: stateName,
          stateCode: state,
          confirmed,
          active: activeCases,
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

  onOptionSelected(event: any) {
    const stateName = event.option.value;
    const stateCode = this.getAllStates(this.covid19HomePageData).find(
      (state) => state.stateName.toLowerCase() === stateName.toLowerCase()
    )?.stateCode;

    if (stateName) {
      this.router.navigate(['/state', stateCode]);
    }
  }

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
