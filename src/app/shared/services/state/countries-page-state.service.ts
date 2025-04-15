import { computed, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { take, tap } from 'rxjs/operators';
import { CountriesPageHttpService } from '../countries-page-http.service';
import { CountriesPageState } from '../../interfaces/countries-page-state.interface';
import { CountrySummary } from '../../interfaces/country-summary.interface';

@Injectable({
  providedIn: 'root',
})
export class CountriesPageStateService {
  constructor(
    private countriesPageHttpService: CountriesPageHttpService,
    private messageService: MessageService
  ) {}

  // Signal that holds the state (initial state)
  private readonly initialState = {
    addedCountries: [],
    listedCountries: [],
  };
  private state = signal<CountriesPageState>(this.initialState);

  // Selectors (slices of state)
  addedCountries = computed(() => this.state().addedCountries);
  listedCountries = computed(() => this.state().listedCountries);

  // Reducers
  // Define how actions should update state
  addCountry(country: CountrySummary) {
    this.state.update((state) => ({
      ...state,
      addedCountries: [...state.addedCountries, country],
    }));
  }

  setListedCountries(listedCountries: CountrySummary[]) {
    this.state.update((state) => ({
      ...state,
      listedCountries,
    }));
  }

  // Actions
  retrieveCountriesList() {
    this.countriesPageHttpService
      .getAllCountries()
      .pipe(
        take(1),
        tap((response) => this.setListedCountries(response))
      )
      .subscribe();
  }

  resetState() {
    this.state.update(() => this.initialState);
  }
}
