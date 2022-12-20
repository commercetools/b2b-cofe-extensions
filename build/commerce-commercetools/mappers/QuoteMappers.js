import { CartMapper } from './CartMapper';
export const mapCommercetoolsQuoteRequest = (results, locale) => {
    return results === null || results === void 0 ? void 0 : results.map((quote) => ({
        ...quote,
        customer: mapCustomerReferences(quote.customer),
        lineItems: mapCommercetoolsLineitems(quote.lineItems, locale),
    }));
};
export const mapCommercetoolsQuote = (results, locale) => {
    return results === null || results === void 0 ? void 0 : results.map((quote) => ({
        ...quote,
        customer: mapCustomerReferences(quote.customer),
        lineItems: mapCommercetoolsLineitems(quote.lineItems, locale),
    }));
};
export const mapCommercetoolsStagedQuote = (results, locale) => {
    return results.map((stagedQuote) => ({
        ...stagedQuote,
        quotationCart: mapQuotationCartReference(stagedQuote.quotationCart, locale),
    }));
};
export const mapCustomerReferences = (customer) => {
    return {
        id: customer.id,
        typeId: 'customer',
        ...customer.obj,
    };
};
export const mapQuotationCartReference = (cartReference, locale) => {
    return cartReference.obj ? CartMapper.commercetoolsCartToCart(cartReference.obj, locale) : cartReference;
};
export const mapCommercetoolsLineitems = (lineitems, locale) => {
    return CartMapper.commercetoolsLineItemsToLineItems(lineitems, locale);
};
//# sourceMappingURL=QuoteMappers.js.map