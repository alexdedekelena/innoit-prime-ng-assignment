import { computed, effect, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, take, tap } from 'rxjs/operators';
import { CountriesPageHttpService } from '../countries-page-http.service';
import { CountriesPageState } from '../../interfaces/countries-page-state.interface';
import { CountrySummary } from '../../interfaces/country-summary.interface';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesPageStateService {
  constructor(
    private countriesPageHttpService: CountriesPageHttpService,
    private messageService: MessageService
  ) {
    // Error Message
    effect(() => {
      if (this.errorMessage()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage(),
        });
        this.setErrorMessage('');
      }
    });
  }

  // Signal that holds the state (initial state)
  private readonly initialState: CountriesPageState = {
    addedCountries: [],
    listedCountries: [],
    errorMessage: '',
    listedCountriesInitialized: false,
  };
  private state = signal<CountriesPageState>(this.initialState);

  // Selectors (slices of state)
  addedCountries = computed(() => this.state().addedCountries);
  listedCountries = computed(() => this.state().listedCountries);
  errorMessage = computed(() => this.state().errorMessage);
  listedCountriesInitialized = computed(
    () => this.state().listedCountriesInitialized
  );

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

  private setListedCountriesInitialized(listedCountriesInitialized: boolean) {
    this.state.update((state) => ({
      ...state,
      listedCountriesInitialized,
    }));
  }

  private setErrorMessage(errorMessage: string) {
    this.state.update((state) => ({
      ...state,
      errorMessage,
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
  /** Gets all countries and initializes the listedCountries signal array if not retrieved yet*/
  retrieveCountriesList() {
    if (!this.listedCountriesInitialized()) {
      this.countriesPageHttpService
        .getAllCountries()
        .pipe(
          take(1),
          tap((response) => {
            this.setListedCountries(response);
            this.setListedCountriesInitialized(true);
          }),
          catchError(() => {
            const errorMessage = 'Error retrieving countries. Please try again';
            this.setErrorMessage(errorMessage);
            return of(errorMessage);
          })
        )
        .subscribe();
    }
  }

  /** Adds country into the list of addedCountries after proper validations */
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
