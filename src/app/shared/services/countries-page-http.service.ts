import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CountrySummary } from '../interfaces/country-summary.interface';
import { CountryApiResponse } from '../interfaces/country-api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CountriesPageHttpService {
  private baseUrl = 'https://restcountries.com/v3.1';
  constructor(private http: HttpClient) {}

  /** Retrieves all countries throug httpClient and maps data required for table */
  getAllCountries(): Observable<CountrySummary[]> {
    return this.http.get<CountryApiResponse[]>(`${this.baseUrl}/all`).pipe(
      map((response) =>
        response.map((country) => ({
          name: country.name?.common,
          flag: country.flags?.png,
          currency: country.currencies
            ? Object.getOwnPropertyNames(country.currencies)[0]
            : '-',
          population: country.population,
          status: country.status,
          map: country.maps.googleMaps,
          continent: country.continents[0] || '-',
        }))
      )
    );
  }
}
