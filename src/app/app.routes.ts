import { Routes } from '@angular/router';
import { HomeComponent } from './core/layout/home/home.component';
import { ContactPageComponent } from './features/contact-page/contact-page.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: '**', component: HomeComponent },
];
