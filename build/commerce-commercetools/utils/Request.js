export const getPath = (request) => {
    var _a;
    return (_a = getHeader(request, 'frontastic-path')) !== null && _a !== void 0 ? _a : request.query.path;
};
export const getLocale = (request) => {
    var _a, _b;
    const locale = (_a = getHeader(request, 'frontastic-locale')) !== null && _a !== void 0 ? _a : request.query.locale;
    if (locale !== undefined) {
        return (_b = getHeader(request, 'frontastic-locale')) !== null && _b !== void 0 ? _b : request.query.locale;
    }
    throw new Error(`Locale is missing from request ${request}`);
};
const getHeader = (request, header) => {
    if (header in request.headers) {
        const foundHeader = request.headers[header];
        if (Array.isArray(foundHeader)) {
            return foundHeader[0];
        }
        return foundHeader;
    }
    return null;
};
//# sourceMappingURL=Request.js.map