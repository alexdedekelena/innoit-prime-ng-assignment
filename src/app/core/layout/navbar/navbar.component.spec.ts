import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { Component, Input } from '@angular/core';
import { Menubar } from 'primeng/menubar';

// Menubar Component causes error with window.mediaMatch function
// Use a Mock component instead to avoid errors out of scope
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'p-menubar',
  template: '<div>MOCK MENUBAR</div>',
})
class MockMenubarComponent {
  @Input() model = [];
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NavbarComponent],
    })
      .overrideComponent(NavbarComponent, {
        remove: {
          imports: [Menubar], // Remove the actual child import
        },
        add: {
          imports: [MockMenubarComponent], // Add the mock child import
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
