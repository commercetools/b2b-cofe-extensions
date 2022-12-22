"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMe = exports.query = exports.create = void 0;
const StoreApi_1 = require("../apis/StoreApi");
const CartApi_1 = require("../apis/CartApi");
const Request_1 = require("../utils/Request");
const BusinessUnitApi_1 = require("../apis/BusinessUnitApi");
const DEFAULT_CHANNEL_KEY = 'default-channel';
const create = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const storeApi = new StoreApi_1.StoreApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const data = yield mapRequestToStore(request, actionContext, storeApi);
    const store = yield storeApi.create(data);
    const response = {
        statusCode: 200,
        body: JSON.stringify(store),
        sessionData: request.sessionData,
    };
    return response;
});
exports.create = create;
const query = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    const storeApi = new StoreApi_1.StoreApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const where = request.query['where'];
    const stores = yield storeApi.query(where);
    const response = {
        statusCode: 200,
        body: JSON.stringify(stores),
        sessionData: request.sessionData,
    };
    return response;
});
exports.query = query;
const setMe = (request, actionContext) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const storeApi = new StoreApi_1.StoreApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const cartApi = new CartApi_1.CartApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
    const data = JSON.parse(request.body);
    const store = yield storeApi.get(data.key);
    let distributionChannel = (_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.organization) === null || _b === void 0 ? void 0 : _b.distributionChannel;
    if ((_c = store === null || store === void 0 ? void 0 : store.distributionChannels) === null || _c === void 0 ? void 0 : _c.length) {
        distributionChannel = store.distributionChannels[0];
    }
    const organization = Object.assign(Object.assign({}, (_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.organization), { store: Object.assign({ typeId: 'store' }, store), distributionChannel });
    const cart = yield cartApi.getForUser((_e = request.sessionData) === null || _e === void 0 ? void 0 : _e.account, organization);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(distributionChannel),
        sessionData: Object.assign(Object.assign({}, request.sessionData), { cartId,
            organization }),
    };
    return response;
});
exports.setMe = setMe;
function getParentDistChannels(parentStores) {
    return __awaiter(this, void 0, void 0, function* () {
        return parentStores.reduce((prev, item) => {
            var _a;
            if (item.distributionChannels.length) {
                return [...prev, ...(_a = item.distributionChannels) === null || _a === void 0 ? void 0 : _a.map((channel) => ({ id: channel.id, typeId: 'channel' }))];
            }
            return prev;
        }, []);
    });
}
function getParentSupplyChannels(parentStores) {
    return __awaiter(this, void 0, void 0, function* () {
        return parentStores.reduce((prev, item) => {
            var _a;
            if (item.supplyChannels.length) {
                return [...prev, ...(_a = item.supplyChannels) === null || _a === void 0 ? void 0 : _a.map((channel) => ({ id: channel.id, typeId: 'channel' }))];
            }
            return prev;
        }, []);
    });
}
function mapRequestToStore(request, actionContext, storeApi) {
    return __awaiter(this, void 0, void 0, function* () {
        const storeBody = JSON.parse(request.body);
        const key = storeBody.account.company.toLowerCase().replace(/ /g, '_');
        const parentBusinessUnit = storeBody.parentBusinessUnit;
        let supplyChannels = [];
        let distributionChannels = [];
        if (parentBusinessUnit) {
            const businessUnitApi = new BusinessUnitApi_1.BusinessUnitApi(actionContext.frontasticContext, (0, Request_1.getLocale)(request));
            const businessUnit = yield businessUnitApi.get(parentBusinessUnit);
            if (businessUnit === null || businessUnit === void 0 ? void 0 : businessUnit.stores) {
                const storeKeys = businessUnit === null || businessUnit === void 0 ? void 0 : businessUnit.stores.map((store) => `"${store.key}"`).join(' ,');
                const results = yield storeApi.query(`key in (${storeKeys})`);
                if (results.length) {
                    distributionChannels = yield getParentDistChannels(results);
                    supplyChannels = yield getParentSupplyChannels(results);
                }
            }
        }
        else {
            supplyChannels.push({
                key: DEFAULT_CHANNEL_KEY,
                typeId: 'channel',
            });
            distributionChannels.push({
                key: DEFAULT_CHANNEL_KEY,
                typeId: 'channel',
            });
        }
        const account = {
            key: `store_${parentBusinessUnit ? `${parentBusinessUnit}_` : ''}${key}`,
            name: storeBody.account.company,
            distributionChannels,
            supplyChannels,
        };
        return account;
    });
}
//# sourceMappingURL=StoreController.js.map