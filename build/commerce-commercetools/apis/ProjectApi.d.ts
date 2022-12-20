import { BaseApi } from './BaseApi';
import { ProjectSettings } from '@Types/ProjectSettings';
export declare class ProjectApi extends BaseApi {
    getProjectSettings: () => Promise<ProjectSettings>;
}
