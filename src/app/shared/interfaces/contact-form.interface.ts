import { FormControl } from '@angular/forms';

//TODO: Check the {nonNullable: true} option in FormGroup creation
export interface ContactForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  message: FormControl<string | null>;
  toaChecked: FormControl<boolean | null>;
}
