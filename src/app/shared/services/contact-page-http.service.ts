import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactMessageBody } from '../interfaces/contact-message.interface';
import { Observable } from 'rxjs';
import { ContactPageResponse } from '../interfaces/contact-page-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactPageHttpService {
  private baseUrl = 'FUTURE_URL_HERE';
  constructor(private http: HttpClient) {}

  /** Sends an message throug HTTP with the indicated ContactMessageBody fields */
  postContactMessage(
    contactMessageBody: ContactMessageBody
  ): Observable<ContactPageResponse> {
    return this.http.post<ContactPageResponse>(
      this.baseUrl,
      contactMessageBody
    );
  }
}
