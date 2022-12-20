import { Variant } from './Variant';

export interface LineItem {
  lineItemId: string;
  name?: string;
  type?: string;
  addedAt?: Date;
  count?: number;
  variant?: Variant;
  _url?: string;
}
