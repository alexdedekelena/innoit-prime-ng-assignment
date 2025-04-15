import { TestBed, waitForAsync } from '@angular/core/testing';
import { ContactPageHttpMockService } from './contact-page-http-mock.service';
import { ContactMessageBody } from '../interfaces/contact-message.interface';

describe('ContactPageHttpMockService', () => {
  let service: ContactPageHttpMockService;

  beforeEach(() => {
    service = TestBed.inject(ContactPageHttpMockService);
  });

  describe('postContactMessage', () => {
    it('should return a response message', waitForAsync(() => {
      const mockedContactMessageBody = {
        message: 'message',
      } as ContactMessageBody;
      service.postContactMessage(mockedContactMessageBody).subscribe(
        (response) => {
          expect(response).toEqual({
            success: true,
            message: 'Message sent!',
            body: mockedContactMessageBody,
          });
        },
        (error) => {
          expect(error).toEqual({
            success: false,
            message: 'Something was wrong! Please try again',
            body: mockedContactMessageBody,
          });
        }
      );
    }));
  });
});
