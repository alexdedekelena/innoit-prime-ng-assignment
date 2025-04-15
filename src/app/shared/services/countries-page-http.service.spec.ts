import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { CountriesPageHttpService } from './countries-page-http.service';
import { of } from 'rxjs';
import { CountrySummary } from '../interfaces/country-summary.interface';

describe('CountriesPageHttpService', () => {
  let service: CountriesPageHttpService;
  let httpClientMock: { get: jest.Mock };

  const mockedCountryApiResponse = {
    name: {
      common: 'Switzerland',
    },
    flags: {
      png: 'https://flagcdn.com/w320/ch.png',
    },
    currencies: { CHF: {} },
    population: 8654622,
    status: 'officially-assigned',
    maps: {
      googleMaps: 'https://goo.gl/maps/uVuZcXaxSx5jLyEC9',
    },
    continents: ['Europe'],
  };

  beforeEach(() => {
    httpClientMock = {
      get: jest.fn().mockReturnValue(of([mockedCountryApiResponse])),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
      ],
    });
    service = TestBed.inject(CountriesPageHttpService);
  });

  describe('getAllCountries', () => {
    it('should call http client get with url', waitForAsync(() => {
      const expectedCountrySummary: CountrySummary = {
        continent: 'Europe',
        currency: 'CHF',
        flag: 'https://flagcdn.com/w320/ch.png',
        map: 'https://goo.gl/maps/uVuZcXaxSx5jLyEC9',
        name: 'Switzerland',
        population: 8654622,
        status: 'officially-assigned',
      };

      service.getAllCountries().subscribe((response) => {
        expect(httpClientMock.get).toHaveBeenCalled();
        expect(response).toEqual([expectedCountrySummary]);
      });
    }));
  });
});
