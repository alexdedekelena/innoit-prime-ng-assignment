import { TestBed, waitForAsync } from '@angular/core/testing';
import { ContactPageHttpMockService } from '../contact-page-http-mock.service';
import { MessageService } from 'primeng/api';
import { ContactPageResponse } from '../../interfaces/contact-page-response.interface';
import { ContactMessageBody } from '../../interfaces/contact-message.interface';
import { of, throwError } from 'rxjs';
import { CountriesPageStateService } from './countries-page-state.service';
import { count } from 'console';
import { CountriesPageHttpService } from '../countries-page-http.service';
import { CountrySummary } from '../../interfaces/country-summary.interface';

describe('CountriesPageStateService', () => {
  let service: CountriesPageStateService;
  let countriesPageHttpServiceMock: { getAllCountries: jest.Mock };
  let messageServiceMock: { add: jest.Mock };

  const mockedResponse: ContactPageResponse = {
    success: true,
    message: 'sent',
    body: {} as ContactMessageBody,
  };

  const mockedCountry: CountrySummary = {
    continent: 'Europe',
    currency: 'CHF',
    flag: 'https://flagcdn.com/w320/ch.png',
    map: 'https://goo.gl/maps/uVuZcXaxSx5jLyEC9',
    name: 'Switzerland',
    population: 8654622,
    status: 'officially-assigned',
  };

  beforeEach(() => {
    countriesPageHttpServiceMock = {
      getAllCountries: jest.fn().mockReturnValue(of([mockedCountry])),
    };
    messageServiceMock = {
      add: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CountriesPageHttpService,
          useValue: countriesPageHttpServiceMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
      ],
    });
    service = TestBed.inject(CountriesPageStateService);
  });

  describe('addCountry', () => {
    it('should add country into the signal array', () => {
      expect(service.addedCountries().length).toBe(0);
      service['addCountry'](mockedCountry);
      // expect(service.addedCountries().length).toBe(1);
      expect(
        service
          .addedCountries()
          .find((country) => country.name === mockedCountry.name)
      ).toEqual(mockedCountry);
    });
  });

  describe('setListedCountries', () => {
    it('should set listedCountries signal', () => {
      expect(service.listedCountries().length).toBe(0);
      service['setListedCountries']([mockedCountry]);
      expect(
        service
          .listedCountries()
          .find((country) => country.name === mockedCountry.name)
      ).toEqual(mockedCountry);
    });
  });

  describe('removeCountryFromListed', () => {
    it('should remove the country in listedCountries array', () => {
      service['setListedCountries']([mockedCountry]);
      expect(service.listedCountries().length).toBe(1);
      service['removeCountryFromListed'](mockedCountry);
      expect(service.listedCountries().length).toBe(0);
    });
  });

  describe('retrieveCountriesList', () => {
    it('should call setListedCountries on success response', () => {
      jest.spyOn(service as never, 'setListedCountries');
      service.retrieveCountriesList();
      // Required service to be any so private method can be tested
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((service as any).setListedCountries).toHaveBeenCalled();
    });
  });

  describe('resetState', () => {
    it('should reset state values to initial', () => {
      service.addCountryToProject(mockedCountry);
      service.resetState();
      expect(service.addedCountries()).toEqual([]);
    });
  });
});
