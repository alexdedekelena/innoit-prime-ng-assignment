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
  private addCountry(country: CountrySummary) {
    this.state.update((state) => ({
      ...state,
      addedCountries: [...state.addedCountries, country],
    }));
  }

  private setListedCountries(listedCountries: CountrySummary[]) {
    this.state.update((state) => ({
      ...state,
      listedCountries,
    }));
  }

  private removeCountryFromListed(country: CountrySummary) {
    this.state.update((state) => {
      return {
        ...state,
        listedCountries: state.listedCountries.filter(
          (countryInList) => countryInList.name !== country.name
        ),
      };
    });
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

  addCountryToProject(country: CountrySummary) {
    const existingCountry = this.addedCountries().find(
      (countryState) => countryState.name === country.name
    );
    if (!existingCountry) {
      this.addCountry(country);
      this.removeCountryFromListed(country);
    }
  }

  resetState() {
    this.state.update(() => this.initialState);
  }
}
