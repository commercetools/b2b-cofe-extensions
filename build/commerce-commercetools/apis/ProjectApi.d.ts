import { BaseApi } from './BaseApi';
import { ProjectSettings } from '../../../node_modules/@b2bdemo/types/build/ProjectSettings';
export declare class ProjectApi extends BaseApi {
    getProjectSettings: () => Promise<ProjectSettings>;
}
