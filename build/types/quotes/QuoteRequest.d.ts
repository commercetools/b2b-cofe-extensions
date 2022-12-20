import { LineItem } from '../cart/LineItem';
import { StagedQuote } from './StagedQuote';
import { Quote } from './Quote';
import { CustomerReference } from '../account/Account';
import { StoreKeyReference } from '../store/store';
import { Money } from '../product/Money';
import { BusinessUnitResourceIdentifier } from '../business-unit/BusinessUnit';
import { Address } from '../account/Address';
export interface QuoteRequestReference {
    id: string;
    typeId: 'quote-request';
    obj?: QuoteRequest;
}
export interface QuoteRequest {
    readonly id: string;
    readonly version: number;
    readonly key?: string;
    readonly createdAt: string;
    readonly lastModifiedAt: string;
    readonly quoteRequestState: string;
    readonly comment?: string;
    readonly customer: CustomerReference;
    readonly store?: StoreKeyReference;
    readonly lineItems: LineItem[];
    readonly totalPrice: Money;
    readonly shippingAddress?: Address;
    readonly billingAddress?: Address;
    readonly country?: string;
    readonly itemShippingAddresses?: Address[];
    readonly directDiscounts?: any[];
    readonly businessUnit?: BusinessUnitResourceIdentifier;
    staged?: StagedQuote;
    quoted?: Quote;
}
