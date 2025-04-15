import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-countries-page',
  imports: [ButtonModule, TableModule, ToolbarModule],
  templateUrl: './countries-page.component.html',
  styleUrl: './countries-page.component.css',
})
export class CountriesPageComponent {
  countries = [
    {
      name: 'Barbados',
      code: 'bb',
      currency: 'BBD',
      population: 287371,
      continent: 'North America',
      active: true,
    },
    {
      name: 'Grenada',
      code: 'gd',
      currency: 'XCD',
      population: 112519,
      continent: 'North America',
      active: true,
    },
    {
      name: 'Hungary',
      code: 'hu',
      currency: 'HUF',
      population: 9749763,
      continent: 'Europe',
      active: true,
    },
    {
      name: 'Pitcairn Islands',
      code: 'pn',
      currency: 'NZD',
      population: 50,
      continent: 'Oceania',
      active: true,
    },
    {
      name: 'Sierra Leone',
      code: 'sl',
      currency: 'SLL',
      population: 7976985,
      continent: 'Africa',
      active: true,
    },
    {
      name: 'South Georgia',
      code: 'gs',
      currency: 'GBP',
      population: 30,
      continent: 'Antarctica',
      active: true,
    },
    {
      name: 'Switzerland',
      code: 'ch',
      currency: 'CHF',
      population: 8654622,
      continent: 'Europe',
      active: true,
    },
    {
      name: 'Taiwan',
      code: 'tw',
      currency: 'TWD',
      population: 23503349,
      continent: 'Asia',
      active: true,
    },
    {
      name: 'Wallis and Futuna',
      code: 'wf',
      currency: 'XPF',
      population: 11750,
      continent: 'Oceania',
      active: true,
    },
  ];
}
