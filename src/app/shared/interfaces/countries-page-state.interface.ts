import { CountrySummary } from './country-summary.interface';

export interface CountriesPageState {
  addedCountries: CountrySummary[];
  listedCountries: CountrySummary[];
  errorMessage: string;
  listedCountriesInitialized: boolean;
}
