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
    success$: of('success'),
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
    sendContactMessage: jest.fn(),
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

  describe('onSubmit', () => {
    it('should call contactPageStateService.sendContactMessage', () => {
      component.onSubmit();
      expect(contactPageStateServiceStub.sendContactMessage).toHaveBeenCalled();
    });
  });

  describe('onFocusOutUpdateState', () => {
    it('should call contactPageStateService.setFirstName with form control value', () => {
      component.contactForm.controls.firstName.setValue('NEW_VALUE');
      component.onFocusOutUpdateState('firstName');
      expect(contactPageStateServiceStub.setFirstName).toHaveBeenCalledWith(
        'NEW_VALUE'
      );
    });

    it('should call contactPageStateService.setLastName with form control value', () => {
      component.contactForm.controls.lastName.setValue('NEW_VALUE');
      component.onFocusOutUpdateState('lastName');
      expect(contactPageStateServiceStub.setLastName).toHaveBeenCalledWith(
        'NEW_VALUE'
      );
    });

    it('should call contactPageStateService.setEmail with form control value', () => {
      component.contactForm.controls.email.setValue('NEW_VALUE');
      component.onFocusOutUpdateState('email');
      expect(contactPageStateServiceStub.setEmail).toHaveBeenCalledWith(
        'NEW_VALUE'
      );
    });

    it('should call contactPageStateService.setMessage with form control value', () => {
      component.contactForm.controls.message.setValue('NEW_VALUE');
      component.onFocusOutUpdateState('message');
      expect(contactPageStateServiceStub.setMessage).toHaveBeenCalledWith(
        'NEW_VALUE'
      );
    });
  });

  // TODO: Check how to trigger success$ from service
  // describe('success$', () => {
  //   it('should call contactForm.reset on service success$', waitForAsync(() => {
  //     jest.spyOn(component.contactForm, 'reset');

  //     contactPageStateServiceStub.success$ = new BehaviorSubject('success');
  //     (contactPageStateServiceStub.success$ as BehaviorSubject<string>).next(
  //       'success'
  //     );
  //     contactPageStateServiceStub.success$.subscribe(() =>
  //       expect(component.contactForm.reset).toHaveBeenCalled()
  //     );
  //   }));
  // });
});
