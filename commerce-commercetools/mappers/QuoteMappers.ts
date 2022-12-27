import {
  CustomerReference,
  LineItem as CommercetoolsLineItem,
  QuoteRequest as CommercetoolsQuoteRequest,
  StagedQuote as CommercetoolsStagedQuote,
  Quote as CommercetoolsQuote,
  CartReference,
} from '@commercetools/platform-sdk';
import { Locale } from '../Locale';
import { LineItem } from '@Types/cart/LineItem';
import { CartMapper } from './CartMapper';
import { QuoteRequest } from '@Types/quotes/QuoteRequest';
import { Quote } from '@Types/quotes/Quote';
import { StagedQuote } from '@Types/quotes/StagedQuote';
import { Cart } from '@Types/cart/Cart';

export const mapCommercetoolsQuoteRequest = (results: CommercetoolsQuoteRequest[], locale: Locale): QuoteRequest[] => {
  return results?.map((quote) => ({
    ...quote,
    customer: mapCustomerReferences(quote.customer),
    lineItems: mapCommercetoolsLineitems(quote.lineItems, locale),
  }));
};

export const mapCommercetoolsQuote = (results: CommercetoolsQuote[], locale: Locale): any[] => {
  return results?.map((quote) => ({
    ...quote,
    customer: mapCustomerReferences(quote.customer),
    lineItems: mapCommercetoolsLineitems(quote.lineItems, locale),
  }));
};

export const mapCommercetoolsStagedQuote = (results: CommercetoolsStagedQuote[], locale: Locale): any[] => {
  return results.map((stagedQuote) => ({
    ...stagedQuote,
    quotationCart: mapQuotationCartReference(stagedQuote.quotationCart, locale),
  }));
};

export const mapCustomerReferences = (customer: CustomerReference): CustomerReference => {
  return {
    id: customer.id,
    typeId: 'customer',
    ...customer.obj,
  };
};

export const mapQuotationCartReference = (cartReference: CartReference, locale: Locale): Cart | CartReference => {
  return cartReference.obj ? CartMapper.commercetoolsCartToCart(cartReference.obj, locale) : cartReference;
};

export const mapCommercetoolsLineitems = (lineitems: CommercetoolsLineItem[], locale: Locale): LineItem[] => {
  return CartMapper.commercetoolsLineItemsToLineItems(lineitems, locale);
};
