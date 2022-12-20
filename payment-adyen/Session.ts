import { Money } from '@Types/product/Money';

export interface CreateSessionDTO {
  amount: Money;
  returnUrl: string;
  expiresAt?: string;
  applicationInfo?: string;
}

export interface CreateSessionPayload extends CreateSessionDTO {
  reference: string;
  countryCode?: string;
  shopperLocale?: string;
  shopperEmail?: string;
  shopperReference?: string;
}

export interface SessionResponse {
  id: string;
  sessionData: string;
  amount: Money;
  countryCode?: string;
  expiresAt: string;
  merchantAccount: string;
  reference: string;
  returnUrl: string;
}

export interface PaymentDetails {
  details: {
    redirectResult: string;
  };
}

export interface PaymentDetailsResponse {
  resultCode: string;
  pspReference: string;
}
