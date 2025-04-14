import { ContactMessageBody } from './contact-message.interface';

export interface ContactPageResponse {
  success: boolean;
  message: string;
  body: ContactMessageBody;
}
