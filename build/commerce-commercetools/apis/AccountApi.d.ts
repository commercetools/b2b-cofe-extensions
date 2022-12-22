import { BaseApi } from './BaseApi';
import { Account } from '../../../node_modules/@b2bdemo/types/build/account/Account';
import { CustomerUpdateAction, CustomerToken } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';
import { BaseAddress } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { Cart } from '../../../node_modules/@b2bdemo/types/build/cart/Cart';
import { Address } from '../../../node_modules/@b2bdemo/types/build/account/Address';
import { PasswordResetToken } from '../../../node_modules/@b2bdemo/types/build/account/PasswordResetToken';
export declare class AccountApi extends BaseApi {
    create: (account: Account, cart: Cart | undefined) => Promise<Account>;
    generateToken: (account: Account) => Promise<CustomerToken>;
    confirmEmail: (token: string) => Promise<Account>;
    login: (account: Account, cart: Cart | undefined, reverify?: boolean) => Promise<Account>;
    updatePassword: (account: Account, oldPassword: string, newPassword: string) => Promise<Account>;
    generatePasswordResetToken: (email: string) => Promise<PasswordResetToken>;
    resetPassword: (token: string, newPassword: string) => Promise<Account>;
    update: (account: Account) => Promise<Account>;
    addAddress: (account: Account, address: Address) => Promise<Account>;
    updateAddress: (account: Account, address: Address) => Promise<Account>;
    removeAddress: (account: Account, address: Address) => Promise<Account>;
    setDefaultBillingAddress: (account: Account, address: Address) => Promise<Account>;
    setDefaultShippingAddress: (account: Account, address: Address) => Promise<Account>;
    protected extractAddresses(account: Account): {
        commercetoolsAddresses: BaseAddress[];
        billingAddresses: number[];
        shippingAddresses: number[];
        defaultBillingAddress: number;
        defaultShippingAddress: number;
    };
    protected fetchAccountVersion(account: Account): Promise<number | undefined>;
    protected updateAccount(account: Account, customerUpdateActions: CustomerUpdateAction[]): Promise<Account>;
}
