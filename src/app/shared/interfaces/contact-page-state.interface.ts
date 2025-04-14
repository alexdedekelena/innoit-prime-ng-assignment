export interface ContactPageState {
  firstName: string;
  lastName?: string;
  email: string;
  message: string;
  toaChecked: boolean;
  errorMessage?: string;
  successMessage?: string;
}
