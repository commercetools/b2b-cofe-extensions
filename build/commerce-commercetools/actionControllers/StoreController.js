import { StoreApi } from '../apis/StoreApi';
import { CartApi } from '../apis/CartApi';
import { getLocale } from '../utils/Request';
import { BusinessUnitApi } from '../apis/BusinessUnitApi';
const DEFAULT_CHANNEL_KEY = 'default-channel';
export const create = async (request, actionContext) => {
    const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request));
    const data = await mapRequestToStore(request, actionContext, storeApi);
    const store = await storeApi.create(data);
    const response = {
        statusCode: 200,
        body: JSON.stringify(store),
        sessionData: request.sessionData,
    };
    return response;
};
export const query = async (request, actionContext) => {
    const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request));
    const where = request.query['where'];
    const stores = await storeApi.query(where);
    const response = {
        statusCode: 200,
        body: JSON.stringify(stores),
        sessionData: request.sessionData,
    };
    return response;
};
export const setMe = async (request, actionContext) => {
    var _a, _b, _c, _d, _e;
    const storeApi = new StoreApi(actionContext.frontasticContext, getLocale(request));
    const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request));
    const data = JSON.parse(request.body);
    const store = await storeApi.get(data.key);
    let distributionChannel = (_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.organization) === null || _b === void 0 ? void 0 : _b.distributionChannel;
    if ((_c = store === null || store === void 0 ? void 0 : store.distributionChannels) === null || _c === void 0 ? void 0 : _c.length) {
        distributionChannel = store.distributionChannels[0];
    }
    const organization = {
        ...(_d = request.sessionData) === null || _d === void 0 ? void 0 : _d.organization,
        store: {
            typeId: 'store',
            ...store,
        },
        distributionChannel,
    };
    const cart = await cartApi.getForUser((_e = request.sessionData) === null || _e === void 0 ? void 0 : _e.account, organization);
    const cartId = cart.cartId;
    const response = {
        statusCode: 200,
        body: JSON.stringify(distributionChannel),
        sessionData: {
            ...request.sessionData,
            cartId,
            organization,
        },
    };
    return response;
};
async function getParentDistChannels(parentStores) {
    return parentStores.reduce((prev, item) => {
        var _a;
        if (item.distributionChannels.length) {
            return [...prev, ...(_a = item.distributionChannels) === null || _a === void 0 ? void 0 : _a.map((channel) => ({ id: channel.id, typeId: 'channel' }))];
        }
        return prev;
    }, []);
}
async function getParentSupplyChannels(parentStores) {
    return parentStores.reduce((prev, item) => {
        var _a;
        if (item.supplyChannels.length) {
            return [...prev, ...(_a = item.supplyChannels) === null || _a === void 0 ? void 0 : _a.map((channel) => ({ id: channel.id, typeId: 'channel' }))];
        }
        return prev;
    }, []);
}
async function mapRequestToStore(request, actionContext, storeApi) {
    const storeBody = JSON.parse(request.body);
    const key = storeBody.account.company.toLowerCase().replace(/ /g, '_');
    const parentBusinessUnit = storeBody.parentBusinessUnit;
    let supplyChannels = [];
    let distributionChannels = [];
    if (parentBusinessUnit) {
        const businessUnitApi = new BusinessUnitApi(actionContext.frontasticContext, getLocale(request));
        const businessUnit = await businessUnitApi.get(parentBusinessUnit);
        if (businessUnit === null || businessUnit === void 0 ? void 0 : businessUnit.stores) {
            const storeKeys = businessUnit === null || businessUnit === void 0 ? void 0 : businessUnit.stores.map((store) => `"${store.key}"`).join(' ,');
            const results = await storeApi.query(`key in (${storeKeys})`);
            if (results.length) {
                distributionChannels = await getParentDistChannels(results);
                supplyChannels = await getParentSupplyChannels(results);
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
}
//# sourceMappingURL=StoreController.js.map