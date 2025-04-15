import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddCountryDialogComponent } from './add-country-dialog.component';
import { CountriesPageStateService } from '../../../../shared/services/state/countries-page-state.service';
import { signal } from '@angular/core';

describe('AddCountryDialogComponent', () => {
  let component: AddCountryDialogComponent;
  let fixture: ComponentFixture<AddCountryDialogComponent>;

  const mockedCountry = {
    continent: 'Europe',
    currency: 'CHF',
    flag: 'https://flagcdn.com/w320/ch.png',
    map: 'https://goo.gl/maps/uVuZcXaxSx5jLyEC9',
    name: 'Switzerland',
    population: 8654622,
    status: 'officially-assigned',
  };

  const countriesPageStateServiceStub = {
    listedCountries: signal([mockedCountry]),
    retrieveCountriesList: jest.fn(),
    addCountryToProject: jest.fn(),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AddCountryDialogComponent],
      providers: [
        {
          provide: CountriesPageStateService,
          useValue: countriesPageStateServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCountryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call countriesPageStateService.retrieveCountriesList', () => {
      component.ngOnInit();
      expect(
        countriesPageStateServiceStub.retrieveCountriesList
      ).toHaveBeenCalled();
    });
  });

  describe('showDialog', () => {
    it('should change visible value to true', () => {
      expect(component.visible).toBe(false);
      component.showDialog();
      expect(component.visible).toBe(true);
    });
  });

  describe('closeDialog', () => {
    it('should call countriesPageStateService.addCountryToProject on selected country formcontrol', () => {
      component.countriesFormGroup.controls.selectedCountry.setValue(
        mockedCountry
      );
      component.closeDialog();
      expect(
        component.countriesPageStateService.addCountryToProject
      ).toHaveBeenCalledWith(mockedCountry);
    });
  });
});
