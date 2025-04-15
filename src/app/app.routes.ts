import { Routes } from '@angular/router';
import { HomeComponent } from './core/layout/home/home.component';
import { ContactPageComponent } from './features/contact-page/contact-page.component';
import { CountriesPageComponent } from './features/countries-page/countries-page.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'countries', component: CountriesPageComponent },
  { path: '**', component: HomeComponent },
];
