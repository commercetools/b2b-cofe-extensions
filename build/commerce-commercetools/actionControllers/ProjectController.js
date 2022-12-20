import { getLocale } from '../utils/Request';
import { ProjectApi } from '../apis/ProjectApi';
export const getProjectSettings = async (request, actionContext) => {
    const projectApi = new ProjectApi(actionContext.frontasticContext, getLocale(request));
    const project = await projectApi.getProjectSettings();
    const response = {
        statusCode: 200,
        body: JSON.stringify(project),
        sessionData: request.sessionData,
    };
    return response;
};
//# sourceMappingURL=ProjectController.js.map