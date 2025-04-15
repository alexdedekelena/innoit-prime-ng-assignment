import { TestBed, waitForAsync } from '@angular/core/testing';

import { ContactMessageBody } from '../interfaces/contact-message.interface';
import { ContactPageHttpService } from './contact-page-http.service';
import { HttpClient } from '@angular/common/http';

describe('ContactPageHttpService', () => {
  let service: ContactPageHttpService;
  let httpClientMock: { post: jest.Mock };

  beforeEach(() => {
    httpClientMock = {
      post: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpClientMock,
        },
      ],
    });
    service = TestBed.inject(ContactPageHttpService);
  });

  describe('postContactMessage', () => {
    it('should call http client post with url', waitForAsync(() => {
      const mockedContactMessageBody = {
        message: 'message',
      } as ContactMessageBody;
      service.postContactMessage(mockedContactMessageBody);
      expect(httpClientMock.post).toHaveBeenCalled();
    }));
  });
});
