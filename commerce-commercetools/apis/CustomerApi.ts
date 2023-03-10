import { BaseApi } from './BaseApi';
import { Account } from '@Types/account/Account';

export class CustomerApi extends BaseApi {
  get: (email: string) => Promise<Account | null> = async (email: string) => {
    const {
      body: { results },
    } = await this.getApiForProject()
      .customers()
      .get({
        queryArgs: {
          where: `email="${email}"`,
          limit: 1,
        },
      })
      .execute();
    return results.length ? results[0] : null;
  };
  getCustomerById: (id: string) => Promise<Account | null> = async (id: string) => {
    const { body } = await this.getApiForProject().customers().withId({ ID: id }).get().execute();
    return body;
  };
}
