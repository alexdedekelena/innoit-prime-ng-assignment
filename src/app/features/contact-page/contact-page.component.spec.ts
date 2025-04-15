import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactPageComponent } from './contact-page.component';
import { MessageService } from 'primeng/api';
import { ContactPageStateService } from '../../shared/services/state/contact-page-state.service';
import { of } from 'rxjs';
import { Component, signal } from '@angular/core';
import { Toast } from 'primeng/toast';

// Toast Component have 'subscribe of undefined' issue when initialized
// Use a Mock component instead to avoid errors out of scope this component
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'p-toast',
  template: '<div>MOCK TOAST</div>',
})
class MockToastComponent {}

describe('ContactPageComponent', () => {
  let component: ContactPageComponent;
  let fixture: ComponentFixture<ContactPageComponent>;

  const messageServiceStub = {
    add: jest.fn(),
  };
  const contactPageStateServiceStub = {
    success$: of(''),
    firstName: signal(''),
    lastName: signal(''),
    email: signal(''),
    message: signal(''),
    toaChecked: signal(false),
    setToaChecked: jest.fn(),
    setFirstName: jest.fn(),
    setLastName: jest.fn(),
    setEmail: jest.fn(),
    setMessage: jest.fn(),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ContactPageComponent],
      providers: [
        {
          provide: MessageService,
          useValue: messageServiceStub,
        },
        {
          provide: ContactPageStateService,
          useValue: contactPageStateServiceStub,
        },
      ],
    })
      .overrideComponent(ContactPageComponent, {
        remove: {
          imports: [Toast], // Remove the actual child import
        },
        add: {
          imports: [MockToastComponent], // Add the mock child import
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ContactPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
