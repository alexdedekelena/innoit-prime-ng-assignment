import { Component, inject, OnInit, signal } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CountriesPageStateService } from '../../../../shared/services/state/countries-page-state.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CountrySummary } from '../../../../shared/interfaces/country-summary.interface';

@Component({
  selector: 'app-add-country-dialog',
  imports: [ReactiveFormsModule, SelectModule, ButtonModule, Dialog],
  templateUrl: './add-country-dialog.component.html',
  styleUrl: './add-country-dialog.component.css',
})
export class AddCountryDialogComponent implements OnInit {
  // Services injection
  countriesPageStateService = inject(CountriesPageStateService);

  // FormGroups
  countriesFormGroup = new FormGroup({
    selectedCountry: new FormControl<CountrySummary | null>(null),
  });

  // Signals
  countries = this.countriesPageStateService.listedCountries;
  // Prime Dialog doesn't support signal for close dialog implementation
  visible = false;

  ngOnInit() {
    this.countriesPageStateService.retrieveCountriesList();
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    const selectedCountry =
      this.countriesFormGroup.controls.selectedCountry.value;
    if (selectedCountry) {
      this.countriesPageStateService.addCountry(selectedCountry);
    }
    this.visible = false;
  }
}
