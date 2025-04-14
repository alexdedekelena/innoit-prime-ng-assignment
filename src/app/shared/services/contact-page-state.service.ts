import { computed, effect, Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ContactPageState } from '../interfaces/contact-page-state.interface';
// import { ContactPageHttpService } from './contact-page-http.service';
import { ContactPageHttpMockService } from './contact-page-http-mock.service';
import { ContactMessageBody } from '../interfaces/contact-message.interface';
import { catchError, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ContactPageResponse } from '../interfaces/contact-page-response.interface';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ContactPageStateService {
  constructor(
    // private contactPageHttpService: ContactPageHttpService,
    private contactPageHttpService: ContactPageHttpMockService,
    private messageService: MessageService
  ) {
    // Effects
    // Success Message
    effect(() => {
      if (this.successMessage()) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.successMessage(),
        });
        this.resetState();
      }
    });

    // Error Message
    effect(() => {
      if (this.errorMessage()) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage(),
        });
        this.setErrorMessage('');
      }
    });
  }

  // Signal that holds the state (initial state)
  private readonly initialState = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    toaChecked: false,
    errorMessage: '',
    successMessage: '',
  };
  private state = signal<ContactPageState>(this.initialState);

  // Selectors (slices of state)
  firstName = computed(() => this.state().firstName);
  lastName = computed(() => this.state().lastName);
  email = computed(() => this.state().email);
  message = computed(() => this.state().message);
  toaChecked = computed(() => this.state().toaChecked);
  errorMessage = computed(() => this.state().errorMessage);
  successMessage = computed(() => this.state().successMessage);

  // RxJs selector
  success$ = toObservable(this.successMessage);

  // Reducers
  // Define how actions should update state
  setFirstName(firstName: string) {
    this.state.update((state) => ({
      ...state,
      firstName,
    }));
  }

  setLastName(lastName: string) {
    this.state.update((state) => ({
      ...state,
      lastName,
    }));
  }

  setEmail(email: string) {
    this.state.update((state) => ({
      ...state,
      email,
    }));
  }

  setMessage(message: string) {
    this.state.update((state) => ({
      ...state,
      message,
    }));
  }

  setToaChecked(toaChecked: boolean) {
    this.state.update((state) => ({
      ...state,
      toaChecked,
    }));
  }

  setErrorMessage(errorMessage: string) {
    this.state.update((state) => ({
      ...state,
      errorMessage,
    }));
  }

  setSuccessMessage(successMessage: string) {
    this.state.update((state) => ({
      ...state,
      successMessage,
    }));
  }

  // Actions
  sendContactMessage() {
    const contactMessageBody: ContactMessageBody = {
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      message: this.message(),
    };
    this.contactPageHttpService
      .postContactMessage(contactMessageBody)
      .pipe(
        take(1),
        tap((response) => {
          if (response.success) {
            this.setSuccessMessage(
              `Thank you ${response.body.firstName}. ${response.message}`
            );
          }
        }),
        catchError((errorResponse: ContactPageResponse) => {
          this.setErrorMessage(errorResponse.message);
          return of(errorResponse);
        })
      )
      .subscribe();
  }

  resetState() {
    this.state.update(() => this.initialState);
  }
}
