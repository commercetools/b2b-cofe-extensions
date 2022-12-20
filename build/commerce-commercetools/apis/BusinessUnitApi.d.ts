import { BaseApi } from './BaseApi';
import { BusinessUnit, BusinessUnitPagedQueryResponse } from '@Types/business-unit/BusinessUnit';
import { BusinessUnit as CommercetoolsBusinessUnit } from '@commercetools/platform-sdk';
export declare class BusinessUnitApi extends BaseApi {
    getOrganizationByBusinessUnit: (businessUnit: BusinessUnit) => Promise<Record<string, object>>;
    getOrganization: (accountId: string) => Promise<Record<string, object>>;
    create: (data: any) => Promise<any>;
    delete: (key: string) => Promise<any>;
    update: (key: string, actions: any[]) => Promise<any>;
    query: (where: string, expand?: string) => Promise<BusinessUnitPagedQueryResponse>;
    getHighestNodesWithAssociation: (businessUnits: BusinessUnit[], accountId: string, filterAdmin?: boolean) => BusinessUnit[];
    getMe: (accountId: string) => Promise<any>;
    getByKey: (key: string) => Promise<CommercetoolsBusinessUnit>;
    get: (key: string, accountId?: string) => Promise<BusinessUnit>;
    setStoresByBusinessUnit: (businessUnit: CommercetoolsBusinessUnit) => Promise<CommercetoolsBusinessUnit>;
    getTree: (accoundId: string) => Promise<BusinessUnit[]>;
}
