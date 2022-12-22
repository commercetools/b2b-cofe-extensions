import { QuoteRequest as CommercetoolsQuoteRequest, QuoteRequestDraft, Quote as CommercetoolsQuote, StagedQuote as CommercetoolsStagedQuote, QuoteState } from '@commercetools/platform-sdk';
import { BaseApi } from './BaseApi';
import { QuoteRequest } from '@Types/quotes/QuoteRequest';
import { Quote } from '@Types/quotes/Quote';
import { StagedQuote } from '@Types/quotes/StagedQuote';
export declare class QuoteApi extends BaseApi {
    createQuoteRequest: (quoteRequest: QuoteRequestDraft) => Promise<CommercetoolsQuoteRequest>;
    getStagedQuote: (ID: string) => Promise<CommercetoolsStagedQuote>;
    getQuote: (ID: string) => Promise<CommercetoolsQuote>;
    getQuoteRequestsByCustomer: (customerId: string) => Promise<QuoteRequest[]>;
    getStagedQuotesByCustomer: (customerId: string) => Promise<StagedQuote[]>;
    getQuotesByCustomer: (customerId: string) => Promise<Quote[]>;
    getQuoteRequestsByBusinessUnit: (businessUnitKeys: string) => Promise<QuoteRequest[]>;
    getStagedQuotesByBusinessUnit: (businessUnitKeys: string) => Promise<StagedQuote[]>;
    getQuotesByBusinessUnit: (businessUnitKeys: string) => Promise<Quote[]>;
    updateQuoteState: (ID: string, quoteState: QuoteState) => Promise<CommercetoolsQuote>;
}
