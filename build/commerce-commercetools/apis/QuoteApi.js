import { mapCommercetoolsQuote, mapCommercetoolsQuoteRequest, mapCommercetoolsStagedQuote, } from '../mappers/QuoteMappers';
import { BaseApi } from './BaseApi';
export class QuoteApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.createQuoteRequest = async (quoteRequest) => {
            try {
                return this.getApiForProject()
                    .quoteRequests()
                    .post({
                    body: {
                        ...quoteRequest,
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
            catch {
                throw '';
            }
        };
        this.getStagedQuote = async (ID) => {
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
            catch {
                throw '';
            }
        };
        this.getQuote = async (ID) => {
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
            catch {
                throw '';
            }
        };
        this.getQuoteRequestsByCustomer = async (customerId) => {
            try {
                const locale = await this.getCommercetoolsLocal();
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
            catch {
                throw '';
            }
        };
        this.getStagedQuotesByCustomer = async (customerId) => {
            const locale = await this.getCommercetoolsLocal();
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
            catch {
                throw '';
            }
        };
        this.getQuotesByCustomer = async (customerId) => {
            const locale = await this.getCommercetoolsLocal();
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
            catch {
                throw '';
            }
        };
        this.getQuoteRequestsByBusinessUnit = async (businessUnitKeys) => {
            const locale = await this.getCommercetoolsLocal();
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
            catch {
                throw '';
            }
        };
        this.getStagedQuotesByBusinessUnit = async (businessUnitKeys) => {
            const locale = await this.getCommercetoolsLocal();
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
            catch {
                throw '';
            }
        };
        this.getQuotesByBusinessUnit = async (businessUnitKeys) => {
            const locale = await this.getCommercetoolsLocal();
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
            catch {
                throw '';
            }
        };
        this.updateQuoteState = async (ID, quoteState) => {
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
            catch {
                throw '';
            }
        };
    }
}
//# sourceMappingURL=QuoteApi.js.map