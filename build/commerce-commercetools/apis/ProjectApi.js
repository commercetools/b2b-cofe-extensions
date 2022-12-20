import { BaseApi } from './BaseApi';
export class ProjectApi extends BaseApi {
    constructor() {
        super(...arguments);
        this.getProjectSettings = async () => {
            const project = await this.getProject();
            return Promise.resolve({
                name: project.name,
                countries: project.countries,
                currencies: project.currencies,
                languages: project.languages,
            });
        };
    }
}
//# sourceMappingURL=ProjectApi.js.map