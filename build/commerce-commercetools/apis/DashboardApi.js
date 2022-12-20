import { BaseApi } from './BaseApi';
export class DashboardApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.create = async (dashboard) => {
            try {
                return this.getApiForProject()
                    .customObjects()
                    .post({
                    body: dashboard,
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
        this.get = async (key, container) => {
            try {
                return this.getApiForProject()
                    .customObjects()
                    .withContainerAndKey({ container, key })
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
    }
}
//# sourceMappingURL=DashboardApi.js.map