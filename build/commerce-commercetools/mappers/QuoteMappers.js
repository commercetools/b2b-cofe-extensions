"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCommercetoolsLineitems = exports.mapQuotationCartReference = exports.mapCustomerReferences = exports.mapCommercetoolsStagedQuote = exports.mapCommercetoolsQuote = exports.mapCommercetoolsQuoteRequest = void 0;
const CartMapper_1 = require("./CartMapper");
const mapCommercetoolsQuoteRequest = (results, locale) => {
    return results === null || results === void 0 ? void 0 : results.map((quote) => (Object.assign(Object.assign({}, quote), { customer: (0, exports.mapCustomerReferences)(quote.customer), lineItems: (0, exports.mapCommercetoolsLineitems)(quote.lineItems, locale) })));
};
exports.mapCommercetoolsQuoteRequest = mapCommercetoolsQuoteRequest;
const mapCommercetoolsQuote = (results, locale) => {
    return results === null || results === void 0 ? void 0 : results.map((quote) => (Object.assign(Object.assign({}, quote), { customer: (0, exports.mapCustomerReferences)(quote.customer), lineItems: (0, exports.mapCommercetoolsLineitems)(quote.lineItems, locale) })));
};
exports.mapCommercetoolsQuote = mapCommercetoolsQuote;
const mapCommercetoolsStagedQuote = (results, locale) => {
    return results.map((stagedQuote) => (Object.assign(Object.assign({}, stagedQuote), { quotationCart: (0, exports.mapQuotationCartReference)(stagedQuote.quotationCart, locale) })));
};
exports.mapCommercetoolsStagedQuote = mapCommercetoolsStagedQuote;
const mapCustomerReferences = (customer) => {
    return Object.assign({ id: customer.id, typeId: 'customer' }, customer.obj);
};
exports.mapCustomerReferences = mapCustomerReferences;
const mapQuotationCartReference = (cartReference, locale) => {
    return cartReference.obj ? CartMapper_1.CartMapper.commercetoolsCartToCart(cartReference.obj, locale) : cartReference;
};
exports.mapQuotationCartReference = mapQuotationCartReference;
const mapCommercetoolsLineitems = (lineitems, locale) => {
    return CartMapper_1.CartMapper.commercetoolsLineItemsToLineItems(lineitems, locale);
};
exports.mapCommercetoolsLineitems = mapCommercetoolsLineitems;
//# sourceMappingURL=QuoteMappers.js.map