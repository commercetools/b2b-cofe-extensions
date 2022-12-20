import { getLocale } from '../utils/Request';
import { DashboardApi } from '../apis/DashboardApi';
const DASHBOARD_CONTAINER = 'dashboard-container';
const DASHBOARD_KEY_POSTFIX = 'dashboard';
const getDashboardKey = (accountId) => {
    return `${accountId}__${DASHBOARD_KEY_POSTFIX}`;
};
export const getMyDashboard = async (request, actionContext) => {
    var _a, _b;
    const dashboardApi = new DashboardApi(actionContext.frontasticContext, getLocale(request));
    const accountId = (_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.accountId;
    if (!accountId) {
        throw new Error('Not logged in');
    }
    let dashboard = null;
    try {
        dashboard = await dashboardApi.get(getDashboardKey(accountId), DASHBOARD_CONTAINER);
    }
    catch (e) {
        dashboard = await dashboardApi.create({
            container: DASHBOARD_CONTAINER,
            key: getDashboardKey(accountId),
            value: {
                customer: {
                    id: accountId,
                    typeId: 'customer',
                },
                widgets: [
                    {
                        id: 'OrderList',
                        layout: {
                            i: 'OrderList',
                            x: 0,
                            y: 2,
                            w: 12,
                            h: 3,
                            isDraggable: undefined,
                        },
                    },
                    {
                        id: 'OrderStatus',
                        layout: {
                            i: 'OrderStatus',
                            x: 0,
                            y: 0,
                            w: 5,
                            h: 2,
                            isDraggable: undefined,
                        },
                    },
                    {
                        id: 'RecentPurchase',
                        layout: {
                            i: 'RecentPurchase',
                            x: 6,
                            y: 0,
                            w: 6,
                            h: 2,
                            isDraggable: undefined,
                        },
                    },
                ],
            },
        });
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(dashboard),
        sessionData: request.sessionData,
    };
    return response;
};
export const updateDashboard = async (request, actionContext) => {
    var _a, _b;
    const dashboardApi = new DashboardApi(actionContext.frontasticContext, getLocale(request));
    const { widgets } = JSON.parse(request === null || request === void 0 ? void 0 : request.body);
    const accountId = (_b = (_a = request.sessionData) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.accountId;
    if (!accountId) {
        throw new Error('Not logged in');
    }
    let dashboard = await dashboardApi.get(getDashboardKey(accountId), DASHBOARD_CONTAINER);
    if (dashboard) {
        dashboard = await dashboardApi.create({
            version: dashboard.version,
            container: DASHBOARD_CONTAINER,
            key: getDashboardKey(accountId),
            value: {
                customer: {
                    id: accountId,
                    typeId: 'customer',
                },
                widgets,
            },
        });
    }
    else {
        throw new Error('dashboard does not exist');
    }
    const response = {
        statusCode: 200,
        sessionData: request.sessionData,
    };
    return response;
};
//# sourceMappingURL=DashboardController.js.map