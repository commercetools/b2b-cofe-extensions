import { BusinessUnit } from '@Types/business-unit/BusinessUnit';
import { BusinessUnit as CommercetoolsBusinessUnit } from '@commercetools/platform-sdk';
import { Store } from '@Types/store/store';
export declare const mapBusinessUnitToBusinessUnit: (businessUnit: CommercetoolsBusinessUnit, allStores: Store[], accountId?: string) => BusinessUnit;
export declare const isUserAdminInBusinessUnit: (businessUnit: BusinessUnit, accountId: string) => boolean;
export declare const isUserRootAdminInBusinessUnit: (businessUnit: BusinessUnit, accountId: string) => boolean;
export declare const addBUsinessUnitAdminFlags: (businessUnit: BusinessUnit, accountId?: string) => BusinessUnit;
export declare const mapReferencedAssociates: (businessUnit: CommercetoolsBusinessUnit) => BusinessUnit;
export declare const mapStoreRefs: (businessUnit: BusinessUnit, allStores: Store[]) => BusinessUnit;
