import { getLocale } from '../utils/Request';
import { CustomerApi } from '../apis/CustomerApi';
export const getById = async (request, actionContext) => {
    const customerApi = new CustomerApi(actionContext.frontasticContext, getLocale(request));
    const customer = await customerApi.getCustomerById(request.query['id']);
    const response = {
        statusCode: 200,
        body: JSON.stringify(customer),
        sessionData: request.sessionData,
    };
    return response;
};
//# sourceMappingURL=CustomerController.js.map