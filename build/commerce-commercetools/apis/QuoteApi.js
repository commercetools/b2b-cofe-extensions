var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mapCommercetoolsQuote, mapCommercetoolsQuoteRequest, mapCommercetoolsStagedQuote, } from '../mappers/QuoteMappers';
import { BaseApi } from './BaseApi';
export class QuoteApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.createQuoteRequest = (quoteRequest) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getApiForProject()
                    .quoteRequests()
                    .post({
                    body: Object.assign({}, quoteRequest),
                })
                    .execute()
                    .then((response) => {
                    return response.body;
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_a) {
                throw '';
            }
        });
        this.getStagedQuote = (ID) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getApiForProject()
                    .stagedQuotes()
                    .withId({ ID })
                    .get({
                    queryArgs: {
                        expand: 'customer',
                        sort: 'createdAt desc',
                    },
                })
                    .execute()
                    .then((response) => {
                    return response.body;
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_b) {
                throw '';
            }
        });
        this.getQuote = (ID) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getApiForProject()
                    .quotes()
                    .withId({ ID })
                    .get()
                    .execute()
                    .then((response) => {
                    return response.body;
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_c) {
                throw '';
            }
        });
        this.getQuoteRequestsByCustomer = (customerId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const locale = yield this.getCommercetoolsLocal();
                return this.getApiForProject()
                    .quoteRequests()
                    .get({
                    queryArgs: {
                        where: `customer(id="${customerId}")`,
                        expand: 'customer',
                        sort: 'createdAt desc',
                        limit: 50,
                    },
                })
                    .execute()
                    .then((response) => {
                    return mapCommercetoolsQuoteRequest(response.body.results, locale);
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_d) {
                throw '';
            }
        });
        this.getStagedQuotesByCustomer = (customerId) => __awaiter(this, void 0, void 0, function* () {
            const locale = yield this.getCommercetoolsLocal();
            try {
                return this.getApiForProject()
                    .stagedQuotes()
                    .get({
                    queryArgs: {
                        where: `customer(id="${customerId}")`,
                        expand: ['customer', 'quotationCart'],
                        sort: 'createdAt desc',
                        limit: 50,
                    },
                })
                    .execute()
                    .then((response) => {
                    return mapCommercetoolsStagedQuote(response.body.results, locale);
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_e) {
                throw '';
            }
        });
        this.getQuotesByCustomer = (customerId) => __awaiter(this, void 0, void 0, function* () {
            const locale = yield this.getCommercetoolsLocal();
            try {
                return this.getApiForProject()
                    .quotes()
                    .get({
                    queryArgs: {
                        where: `customer(id="${customerId}")`,
                        expand: 'customer',
                        sort: 'createdAt desc',
                        limit: 50,
                    },
                })
                    .execute()
                    .then((response) => {
                    return mapCommercetoolsQuote(response.body.results, locale);
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_f) {
                throw '';
            }
        });
        this.getQuoteRequestsByBusinessUnit = (businessUnitKeys) => __awaiter(this, void 0, void 0, function* () {
            const locale = yield this.getCommercetoolsLocal();
            try {
                return this.getApiForProject()
                    .quoteRequests()
                    .get({
                    queryArgs: {
                        where: `businessUnit(key in (${businessUnitKeys}))`,
                        expand: 'customer',
                        sort: 'createdAt desc',
                        limit: 50,
                    },
                })
                    .execute()
                    .then((response) => {
                    return mapCommercetoolsQuoteRequest(response.body.results, locale);
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_g) {
                throw '';
            }
        });
        this.getStagedQuotesByBusinessUnit = (businessUnitKeys) => __awaiter(this, void 0, void 0, function* () {
            const locale = yield this.getCommercetoolsLocal();
            try {
                return this.getApiForProject()
                    .stagedQuotes()
                    .get({
                    queryArgs: {
                        where: `businessUnit(key in (${businessUnitKeys}))`,
                        expand: ['customer', 'quotationCart'],
                        sort: 'createdAt desc',
                        limit: 50,
                    },
                })
                    .execute()
                    .then((response) => {
                    return mapCommercetoolsStagedQuote(response.body.results, locale);
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_h) {
                throw '';
            }
        });
        this.getQuotesByBusinessUnit = (businessUnitKeys) => __awaiter(this, void 0, void 0, function* () {
            const locale = yield this.getCommercetoolsLocal();
            try {
                return this.getApiForProject()
                    .quotes()
                    .get({
                    queryArgs: {
                        where: `businessUnit(key in (${businessUnitKeys}))`,
                        expand: 'customer',
                        sort: 'createdAt desc',
                        limit: 50,
                    },
                })
                    .execute()
                    .then((response) => {
                    return mapCommercetoolsQuote(response.body.results, locale);
                })
                    .catch((error) => {
                    throw error;
                });
            }
            catch (_j) {
                throw '';
            }
        });
        this.updateQuoteState = (ID, quoteState) => __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getQuote(ID).then((quote) => {
                    return this.getApiForProject()
                        .quotes()
                        .withId({ ID })
                        .post({
                        body: {
                            actions: [
                                {
                                    action: 'changeQuoteState',
                                    quoteState: quoteState,
                                },
                            ],
                            version: quote.version,
                        },
                    })
                        .execute()
                        .then((response) => {
                        return response.body;
                    })
                        .catch((error) => {
                        throw error;
                    });
                });
            }
            catch (_k) {
                throw '';
            }
        });
    }
}
//# sourceMappingURL=QuoteApi.js.map