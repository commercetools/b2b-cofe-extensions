var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientFactory } from '../ClientFactory';
import { getConfig } from '../utils/GetConfig';
const localeRegex = /^(?<language>[a-z]{2,})(?:_(?<territory>[A-Z]{2,}))?(?:\.(?<codeset>[A-Z0-9_+-]+))?(?:@(?<modifier>[A-Za-z]+))?$/;
const languageToTerritory = {
    en: 'GB',
};
const modifierToCurrency = {
    euro: 'EUR',
};
const territoryToCurrency = {
    AD: 'EUR',
    AE: 'AED',
    AF: 'AFN',
    AG: 'XCD',
    AI: 'XCD',
    AL: 'ALL',
    AM: 'AMD',
    AN: 'ANG',
    AO: 'AOA',
    AQ: 'AQD',
    AR: 'ARS',
    AS: 'EUR',
    AT: 'EUR',
    AU: 'AUD',
    AW: 'ANG',
    AX: 'EUR',
    AZ: 'AZN',
    BA: 'BAM',
    BB: 'BBD',
    BD: 'BDT',
    BE: 'EUR',
    BF: 'XOF',
    BG: 'BGN',
    BH: 'BHD',
    BI: 'BIF',
    BJ: 'XOF',
    BL: 'EUR',
    BM: 'BMD',
    BN: 'BND',
    BO: 'BOB',
    BR: 'BRL',
    BS: 'BSD',
    BT: 'INR',
    BV: 'NOK',
    BW: 'BWP',
    BY: 'BYR',
    BZ: 'BZD',
    CA: 'CAD',
    CC: 'AUD',
    CD: 'CDF',
    CF: 'XAF',
    CG: 'XAF',
    CH: 'CHF',
    CI: 'XOF',
    CK: 'NZD',
    CL: 'CLP',
    CM: 'XAF',
    CN: 'CNY',
    CO: 'COP',
    CR: 'CRC',
    CU: 'CUP',
    CV: 'CVE',
    CX: 'AUD',
    CY: 'CYP',
    CZ: 'CZK',
    DE: 'EUR',
    DJ: 'DJF',
    DK: 'DKK',
    DM: 'XCD',
    DO: 'DOP',
    DZ: 'DZD',
    EC: 'ECS',
    EE: 'EEK',
    EG: 'EGP',
    EH: 'MAD',
    ER: 'ETB',
    ES: 'EUR',
    ET: 'ETB',
    FI: 'EUR',
    FJ: 'FJD',
    FK: 'FKP',
    FM: 'USD',
    FO: 'DKK',
    FR: 'EUR',
    GA: 'XAF',
    GB: 'GBP',
    GD: 'XCD',
    GE: 'GEL',
    GF: 'EUR',
    GG: 'GGP',
    GH: 'GHS',
    GI: 'GIP',
    GL: 'DKK',
    GM: 'GMD',
    GN: 'GNF',
    GP: 'EUR',
    GQ: 'XAF',
    GR: 'EUR',
    GS: 'GBP',
    GT: 'GTQ',
    GU: 'USD',
    GW: 'XOF',
    GY: 'GYD',
    HK: 'HKD',
    HM: 'AUD',
    HN: 'HNL',
    HR: 'HRK',
    HT: 'HTG',
    HU: 'HUF',
    ID: 'IDR',
    IE: 'EUR',
    IL: 'ILS',
    IM: 'GBP',
    IN: 'INR',
    IO: 'USD',
    IQ: 'IQD',
    IR: 'IRR',
    IS: 'ISK',
    IT: 'EUR',
    JE: 'GBP',
    JM: 'JMD',
    JO: 'JOD',
    JP: 'JPY',
    KE: 'KES',
    KG: 'KGS',
    KH: 'KHR',
    KI: 'AUD',
    KM: 'KMF',
    KN: 'XCD',
    KP: 'KPW',
    KR: 'KRW',
    KW: 'KWD',
    KY: 'KYD',
    KZ: 'KZT',
    LA: 'LAK',
    LB: 'LBP',
    LC: 'XCD',
    LI: 'CHF',
    LK: 'LKR',
    LR: 'LRD',
    LS: 'LSL',
    LT: 'LTL',
    LU: 'EUR',
    LV: 'LVL',
    LY: 'LYD',
    MA: 'MAD',
    MC: 'EUR',
    MD: 'MDL',
    ME: 'EUR',
    MF: 'ANG',
    MG: 'MGA',
    MH: 'USD',
    MK: 'MKD',
    ML: 'XOF',
    MM: 'MMK',
    MN: 'MNT',
    MO: 'MOP',
    MP: 'USD',
    MQ: 'EUR',
    MR: 'MRO',
    MS: 'XCD',
    MT: 'MTL',
    MU: 'MUR',
    MV: 'MVR',
    MW: 'MWK',
    MX: 'MXN',
    MY: 'MYR',
    MZ: 'MZN',
    NA: 'NAD',
    NC: 'XPF',
    NE: 'XOF',
    NF: 'AUD',
    NG: 'NGN',
    NI: 'NIO',
    NL: 'EUR',
    NO: 'NOK',
    NP: 'NPR',
    NR: 'AUD',
    NU: 'NZD',
    NZ: 'NZD',
    OM: 'OMR',
    PA: 'PAB',
    PE: 'PEN',
    PF: 'XPF',
    PG: 'PGK',
    PH: 'PHP',
    PK: 'PKR',
    PL: 'PLN',
    PM: 'EUR',
    PN: 'NZD',
    PR: 'USD',
    PS: 'JOD',
    PT: 'EUR',
    PW: 'USD',
    PY: 'PYG',
    QA: 'QAR',
    RE: 'EUR',
    RO: 'RON',
    RS: 'RSD',
    RU: 'RUB',
    RW: 'RWF',
    SA: 'SAR',
    SB: 'SBD',
    SC: 'SCR',
    SD: 'SDG',
    SE: 'SEK',
    SG: 'SGD',
    SH: 'GBP',
    SI: 'EUR',
    SJ: 'NOK',
    SK: 'SKK',
    SL: 'SLL',
    SM: 'EUR',
    SN: 'XOF',
    SO: 'SOS',
    SR: 'SRD',
    ST: 'STD',
    SV: 'SVC',
    SY: 'SYP',
    SZ: 'SZL',
    TC: 'USD',
    TD: 'XAF',
    TF: 'EUR',
    TG: 'XOF',
    TH: 'THB',
    TJ: 'TJS',
    TK: 'NZD',
    TM: 'TMT',
    TN: 'TND',
    TO: 'TOP',
    TP: 'IDR',
    TR: 'TRY',
    TT: 'TTD',
    TV: 'AUD',
    TW: 'TWD',
    TZ: 'TZS',
    UA: 'UAH',
    UG: 'UGX',
    UM: 'USD',
    USAF: 'USD',
    US: 'USD',
    UY: 'UYU',
    UZ: 'UZS',
    VA: 'EUR',
    VC: 'XCD',
    VE: 'VEF',
    VG: 'USD',
    VI: 'USD',
    VN: 'VND',
    VU: 'VUV',
    WF: 'XPF',
    WS: 'EUR',
    YE: 'YER',
    YT: 'EUR',
    ZA: 'ZAR',
    ZM: 'ZMK',
    ZW: 'ZWD',
};
const parseLocale = (locale) => {
    const matches = locale.match(localeRegex);
    if (matches === null) {
        throw new Error(`Invalid locale: ${locale}`);
    }
    const language = matches.groups.language;
    let territory = matches.groups.territory;
    if (territory === undefined) {
        if (language in languageToTerritory) {
            territory = languageToTerritory[language];
        }
        else {
            territory = language.toUpperCase();
        }
    }
    let currency = undefined;
    const modifier = matches.groups.modifier;
    if (modifier !== undefined) {
        if (modifier in modifierToCurrency) {
            currency = modifierToCurrency[modifier];
        }
        else {
            const foundCurrency = Object.values(territoryToCurrency).find((currency) => currency === modifier.toUpperCase());
            if (foundCurrency !== undefined) {
                currency = foundCurrency;
            }
        }
    }
    if (currency === undefined) {
        if (territory in territoryToCurrency) {
            currency = territoryToCurrency[territory];
        }
        else {
            currency = 'EUR';
        }
    }
    return {
        language,
        territory,
        currency,
    };
};
const projectCacheTtlMilliseconds = 10 * 60 * 1000;
const projectCache = {};
const productTypesCache = {};
const pickCandidate = (candidates, availableOptions) => {
    for (const candidate of candidates) {
        const found = availableOptions.find((option) => option.toLowerCase() === candidate.toLowerCase());
        if (found !== undefined) {
            return found;
        }
    }
    return undefined;
};
const pickCommercetoolsLanguage = (parsedLocale, availableLanguages) => {
    const candidates = [`${parsedLocale.language}-${parsedLocale.territory}`, parsedLocale.language];
    const foundCandidate = pickCandidate(candidates, availableLanguages);
    if (foundCandidate !== undefined) {
        return foundCandidate;
    }
    const prefix = `${parsedLocale.language.toLowerCase()}-`;
    const foundPrefix = availableLanguages.find((option) => option.toLowerCase().startsWith(prefix));
    if (foundPrefix !== undefined) {
        return foundPrefix;
    }
    return availableLanguages[0];
};
const pickCommercetoolsCountry = (parsedLocale, language, availableCountries) => {
    const candidates = [parsedLocale.territory, parsedLocale.language, language];
    const foundCandidate = pickCandidate(candidates, availableCountries);
    if (foundCandidate !== undefined) {
        return foundCandidate;
    }
    return availableCountries[0];
};
const pickCommercetoolsCurrency = (parsedLocale, availableCurrencies) => {
    const candidates = [
        parsedLocale.currency,
        parseLocale(`${parsedLocale.language}_${parsedLocale.territory}`).currency,
    ];
    const foundCandidate = pickCandidate(candidates, availableCurrencies);
    if (foundCandidate !== undefined) {
        return foundCandidate;
    }
    return availableCurrencies[0];
};
export class BaseApi {
    constructor(frontasticContext, locale) {
        const engine = 'commercetools';
        const clientSettings = getConfig(frontasticContext.project, engine, locale);
        const client = ClientFactory.factor(clientSettings, frontasticContext.environment);
        this.apiRoot = createApiBuilderFromCtpClient(client);
        this.projectKey = clientSettings.projectKey;
        this.locale = locale;
        this.frontasticContext = frontasticContext;
    }
    getApiForProject() {
        return this.apiRoot.withProjectKey({ projectKey: this.projectKey });
    }
    getCommercetoolsLocal() {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedLocale = parseLocale(this.locale);
            const project = yield this.getProject();
            const language = pickCommercetoolsLanguage(parsedLocale, project.languages);
            const country = pickCommercetoolsCountry(parsedLocale, language, project.countries);
            const currency = pickCommercetoolsCurrency(parsedLocale, project.currencies);
            return Promise.resolve({
                language,
                country,
                currency,
            });
        });
    }
    getProductTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            if (this.projectKey in productTypesCache) {
                const cacheEntry = productTypesCache[this.projectKey];
                if (cacheEntry.expiryTime < now) {
                    return cacheEntry.productTypes;
                }
            }
            const response = yield this.getApiForProject().productTypes().get().execute();
            const productTypes = response.body.results;
            productTypesCache[this.projectKey] = {
                productTypes,
                expiryTime: new Date(now.getMilliseconds() + projectCacheTtlMilliseconds),
            };
            return productTypes;
        });
    }
    getProject() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            if (this.projectKey in projectCache) {
                const cacheEntry = projectCache[this.projectKey];
                if (cacheEntry.expiryTime < now) {
                    return cacheEntry.project;
                }
            }
            const response = yield this.getApiForProject().get().execute();
            const project = response.body;
            projectCache[this.projectKey] = {
                project,
                expiryTime: new Date(now.getMilliseconds() + projectCacheTtlMilliseconds),
            };
            return project;
        });
    }
}
//# sourceMappingURL=BaseApi.js.map