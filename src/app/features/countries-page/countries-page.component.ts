import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { AddCountryDialogComponent } from './components/add-country-dialog/add-country-dialog.component';
import { CountriesPageStateService } from '../../shared/services/state/countries-page-state.service';

@Component({
  selector: 'app-countries-page',
  imports: [
    ButtonModule,
    TableModule,
    ToolbarModule,
    AddCountryDialogComponent,
  ],
  templateUrl: './countries-page.component.html',
  styleUrl: './countries-page.component.css',
})
export class CountriesPageComponent {
  // Services injection
  countriesPageStateService = inject(CountriesPageStateService);

  // Signals
  countries = this.countriesPageStateService.addedCountries;

  /** Navigates to google map link throuhg a new tab, without asking user he is about to navigate =)*/
  navigatesToGoogleMap(mapLink: string) {
    if (
      mapLink.startsWith('https://goo.gl/maps/') ||
      mapLink.startsWith('https://google.com/maps/')
    ) {
      window.open(mapLink);
    }
  }
}
