import { Injectable } from '@angular/core';
import { ContactMessageBody } from '../interfaces/contact-message.interface';
import { Observable, of, throwError } from 'rxjs';
import { ContactPageResponse } from '../interfaces/contact-page-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactPageHttpMockService {
  /** MOCK: randomizes HTTP endpoint response with success (60%) or fail (40%) */
  postContactMessage(
    contactMessageBody: ContactMessageBody
  ): Observable<ContactPageResponse> {
    const randomNumber = Math.floor(Math.random() * 5);

    // error path response
    if (randomNumber > 3) {
      return throwError(() => ({
        success: false,
        message: 'Something was wrong! Please try again',
        body: contactMessageBody,
      }));
    }

    // happy path response
    return of({
      success: true,
      message: 'Message sent!',
      body: contactMessageBody,
    });
  }
}
