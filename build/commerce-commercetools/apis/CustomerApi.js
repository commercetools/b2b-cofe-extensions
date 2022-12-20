import { BaseApi } from './BaseApi';
export class CustomerApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.get = async (email) => {
            const { body: { results }, } = await this.getApiForProject()
                .customers()
                .get({
                queryArgs: {
                    where: `email="${email}"`,
                    limit: 1,
                },
            })
                .execute();
            return results.length ? results[0] : null;
        };
        this.getCustomerById = async (id) => {
            const { body } = await this.getApiForProject().customers().withId({ ID: id }).get().execute();
            return body;
        };
    }
}
//# sourceMappingURL=CustomerApi.js.map