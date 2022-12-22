import { Customer as commercetoolsCustomer } from '@commercetools/platform-sdk';
import { Locale } from '../Locale';
import { Account } from '@Types/account/Account';
import { Address } from '@Types/account/Address';
import { BaseAddress } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
export declare class AccountMapper {
    static commercetoolsCustomerToAccount: (commercetoolsCustomer: commercetoolsCustomer, locale: Locale) => Account;
    static commercetoolsCustomerToAddresses: (commercetoolsCustomer: commercetoolsCustomer, locale: Locale) => Address[];
    static addressToCommercetoolsAddress: (address: Address) => BaseAddress;
}
