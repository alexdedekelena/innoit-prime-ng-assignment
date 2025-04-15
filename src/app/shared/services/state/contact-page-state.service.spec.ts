import { TestBed, waitForAsync } from '@angular/core/testing';
import { ContactPageStateService } from './contact-page-state.service';
import { ContactPageHttpMockService } from '../contact-page-http-mock.service';
import { MessageService } from 'primeng/api';
import { ContactPageResponse } from '../../interfaces/contact-page-response.interface';
import { ContactMessageBody } from '../../interfaces/contact-message.interface';
import { of, throwError } from 'rxjs';

describe('ContactPageStateService', () => {
  let service: ContactPageStateService;
  let contactPageHttpServiceMock: { postContactMessage: jest.Mock };
  let messageServiceMock: { add: jest.Mock };

  const mockedResponse: ContactPageResponse = {
    success: true,
    message: 'sent',
    body: {} as ContactMessageBody,
  };

  beforeEach(() => {
    contactPageHttpServiceMock = {
      postContactMessage: jest.fn().mockReturnValue(of(mockedResponse)),
    };
    messageServiceMock = {
      add: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ContactPageHttpMockService,
          useValue: contactPageHttpServiceMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
      ],
    });
    service = TestBed.inject(ContactPageStateService);
  });

  describe('set methods', () => {
    describe('setFirstName', () => {
      it('should update state for firstName', () => {
        service.setFirstName('newFirstName');
        expect(service.firstName()).toEqual('newFirstName');
      });
    });

    describe('setLastName', () => {
      it('should update state for lastName', () => {
        service.setLastName('newLastName');
        expect(service.lastName()).toEqual('newLastName');
      });
    });

    describe('setEmail', () => {
      it('should update state for email', () => {
        service.setEmail('newEmail');
        expect(service.email()).toEqual('newEmail');
      });
    });

    describe('setMessage', () => {
      it('should update state for message', () => {
        service.setMessage('newMessage');
        expect(service.message()).toEqual('newMessage');
      });
    });

    describe('setToaChecked', () => {
      it('should update state for toaChecked', () => {
        service.setToaChecked(true);
        expect(service.toaChecked()).toEqual(true);
      });
    });

    describe('setErrorMessage', () => {
      it('should update state for errorMessage', () => {
        service.setErrorMessage('newMessage');
        expect(service.errorMessage()).toEqual('newMessage');
      });
    });

    describe('setSuccessMessage', () => {
      it('should update state for successMessage', () => {
        service.setSuccessMessage('newMessage');
        expect(service.successMessage()).toEqual('newMessage');
      });
    });
  });

  // TODO: investigate how to trigger effects for test coverage
  // describe('effects', () => {
  //   it('should call messageService add when success message arrives', waitForAsync(() => {
  //     service.setSuccessMessage('New success message');
  //     expect(messageServiceMock.add).toHaveBeenCalled();
  //   }));

  //   it('should call messageService add when error message arrives', () => {
  //     service.setErrorMessage('New error message');
  //     expect(messageServiceMock.add).toHaveBeenCalled();
  //   });
  // });

  describe('sendContactMessage', () => {
    it('should call postContactMessage method', () => {
      service.sendContactMessage();
      expect(contactPageHttpServiceMock.postContactMessage).toHaveBeenCalled();
    });

    it('should call setErrorMessage method on error', waitForAsync(() => {
      jest.spyOn(service, 'setErrorMessage');
      contactPageHttpServiceMock.postContactMessage.mockReturnValue(
        throwError(() => mockedResponse)
      );
      service.sendContactMessage();
      expect(service.setErrorMessage).toHaveBeenCalled();
    }));
  });

  describe('resetState', () => {
    it('should reset state values to initial', () => {
      service.setFirstName('different name');
      service.resetState();
      expect(service.firstName()).toBe('');
    });
  });
});
