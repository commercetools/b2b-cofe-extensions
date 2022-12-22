import { BaseApi } from './BaseApi';
import { DashboardCustomObjectDraft, DashboardCustomObject } from '../../../node_modules/@b2bdemo/types/build/dashboard/Dashboard';
export declare class DashboardApi extends BaseApi {
    create: (dashboard: DashboardCustomObjectDraft) => Promise<DashboardCustomObject>;
    get: (key: string, container: string) => Promise<DashboardCustomObject>;
}
