"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const getConfig = (project, engine, locale) => {
    var _a, _b, _c, _d, _e;
    if (!project.configuration[engine]) {
        throw `Configuration details are not available for ${engine}`;
    }
    return {
        authUrl: (_a = project.configuration) === null || _a === void 0 ? void 0 : _a[engine].authUrl,
        clientId: (_b = project.configuration) === null || _b === void 0 ? void 0 : _b[engine].clientId,
        clientSecret: (_c = project.configuration) === null || _c === void 0 ? void 0 : _c[engine].clientSecret,
        hostUrl: (_d = project.configuration) === null || _d === void 0 ? void 0 : _d[engine].hostUrl,
        projectKey: (_e = project.configuration) === null || _e === void 0 ? void 0 : _e[engine].projectKey,
    };
};
exports.getConfig = getConfig;
//# sourceMappingURL=GetConfig.js.map