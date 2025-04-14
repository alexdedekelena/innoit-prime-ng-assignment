import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { ContactPageStateService } from '../../shared/services/contact-page-state.service';
import { filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactForm } from '../../shared/interfaces/contact-form.interface';

@Component({
  selector: 'app-contact-page',
  imports: [
    ReactiveFormsModule,
    TextareaModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    Toast,
  ],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css',
})
export class ContactPageComponent {
  constructor() {
    // Updates state when control value changes.
    // Avoid to be use on text input because it will trigger every time a letter is entered/removed. Use focus out event instead.
    this.contactForm.controls.toaChecked.valueChanges
      .pipe(
        tap((value) =>
          this.contactPageStateService.setToaChecked(value || false)
        ),
        takeUntilDestroyed()
      )
      .subscribe();

    // Subscribes to success notification to reset contact FormGroup
    this.contactPageStateService.success$
      .pipe(
        filter((success) => !!success?.length),
        tap(() => this.contactForm.reset()),
        takeUntilDestroyed()
      )
      .subscribe();
  }
  // Services Injection
  contactPageStateService = inject(ContactPageStateService);

  // FormGroup
  contactForm: FormGroup<ContactForm> = new FormGroup({
    firstName: new FormControl(this.contactPageStateService.firstName() || '', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    lastName: new FormControl(
      this.contactPageStateService.lastName() || '',
      Validators.maxLength(30)
    ),
    email: new FormControl(this.contactPageStateService.email() || '', [
      Validators.required,
      Validators.email,
      Validators.maxLength(50),
    ]),
    message: new FormControl(this.contactPageStateService.message() || '', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    toaChecked: new FormControl(
      this.contactPageStateService.toaChecked() || false,
      Validators.required
    ),
  });

  /** Triggers action sendContactMessage which generates body request with current state */
  onSubmit() {
    this.contactPageStateService.sendContactMessage();
  }

  /** Updates state slice of the form field when focus out event triggered */
  onFocusOutUpdateState(formControlName: string) {
    switch (formControlName) {
      case 'firstName':
        this.contactPageStateService.setFirstName(
          this.contactForm.controls.firstName.value || ''
        );
        break;

      case 'lastName':
        this.contactPageStateService.setLastName(
          this.contactForm.controls.lastName.value || ''
        );
        break;

      case 'email':
        this.contactPageStateService.setEmail(
          this.contactForm.controls.email.value || ''
        );
        break;

      case 'message':
        this.contactPageStateService.setMessage(
          this.contactForm.controls.message.value || ''
        );
        break;

      default:
        break;
    }
  }
}
