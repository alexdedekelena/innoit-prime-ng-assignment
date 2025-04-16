import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CountriesPageComponent } from './countries-page.component';
import { Component, signal } from '@angular/core';
import { CountriesPageStateService } from '../../shared/services/state/countries-page-state.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

// Toast Component have 'subscribe of undefined' issue when initialized
// Use a Mock component instead to avoid errors out of scope this component
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'p-toast',
  template: '<div>MOCK TOAST</div>',
})
class MockToastComponent {}

describe('CountriesPageComponent', () => {
  let component: CountriesPageComponent;
  let fixture: ComponentFixture<CountriesPageComponent>;
  let mockWindowOpen: jest.Mock;

  const mockedCountry = {
    continent: 'Europe',
    currency: 'CHF',
    flag: 'https://flagcdn.com/w320/ch.png',
    map: 'https://goo.gl/maps/uVuZcXaxSx5jLyEC9',
    name: 'Switzerland',
    population: 8654622,
    status: 'officially-assigned',
  };

  const messageServiceStub = {
    add: jest.fn(),
  };
  const countriesPageStateServiceStub = {
    addedCountries: signal([mockedCountry]),
    listedCountries: signal([mockedCountry]),
    retrieveCountriesList: jest.fn(),
    addCountryToProject: jest.fn(),
  };

  beforeEach(waitForAsync(() => {
    // Create a Jest mock function for window.open
    mockWindowOpen = jest.fn();

    // Temporarily replace the global window.open with our mock
    Object.defineProperty(window, 'open', {
      value: mockWindowOpen,
      writable: true,
    });

    TestBed.configureTestingModule({
      imports: [CountriesPageComponent],
      providers: [
        {
          provide: CountriesPageStateService,
          useValue: countriesPageStateServiceStub,
        },
        {
          provide: MessageService,
          useValue: messageServiceStub,
        },
      ],
    })
      .overrideComponent(CountriesPageComponent, {
        remove: {
          imports: [Toast], // Remove the actual child import
        },
        add: {
          imports: [MockToastComponent], // Add the mock child import
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CountriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigatesToGoogleMap', () => {
    afterAll(() => {
      // Restore the original window.open after each test
      Object.defineProperty(window, 'open', {
        value: window.open, // Use the original reference
        writable: true,
      });
    });

    it('should call window.open with given link', () => {
      component.navigatesToGoogleMap(mockedCountry.map);
      expect(mockWindowOpen).toHaveBeenCalledWith(mockedCountry.map);
    });

    it('should not call window.open with wrong url', () => {
      component.navigatesToGoogleMap('');
      expect(mockWindowOpen).not.toHaveBeenCalled();
    });
  });
});
