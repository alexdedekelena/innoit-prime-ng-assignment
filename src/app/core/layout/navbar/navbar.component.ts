import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, Menubar],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      route: '/home',
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope',
      route: '/contact',
    },
  ];
}
