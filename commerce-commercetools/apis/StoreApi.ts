import { BaseApi } from './BaseApi';
import { Store } from '@Types/store/store';
import { StoreDraft, Store as CommercetoolsStore } from '@commercetools/platform-sdk';
import { mapCommercetoolsStoreToStore } from '../mappers/StoreMappers';

const convertStoreToBody = (store: Store, locale: string): StoreDraft => {
  return {
    ...store,
    name: {
      [locale]: store.name,
    },
  };
};

export class StoreApi extends BaseApi {
  create: (store: Store) => Promise<any> = async (store: Store) => {
    const locale = await this.getCommercetoolsLocal();
    const body = convertStoreToBody(store, locale.language);

    try {
      return this.getApiForProject()
        .stores()
        .post({
          body,
        })
        .execute()
        .then((response) => {
          return response.body;
        })
        .catch((error) => {
          throw error;
        });
    } catch {
      throw '';
    }
  };

  get: (key: string) => Promise<any> = async (key: string): Promise<Store> => {
    const locale = await this.getCommercetoolsLocal();
    const config = this.frontasticContext?.project?.configuration?.preBuy;

    try {
      return this.getApiForProject()
        .stores()
        .withKey({ key })
        .get()
        .execute()
        .then((response) => {
          return mapCommercetoolsStoreToStore(response.body, locale.language, config);
        });
    } catch (e) {
      console.log(e);

      throw '';
    }
  };

  query: (where?: string) => Promise<any> = async (where: string): Promise<Store[]> => {
    const locale = await this.getCommercetoolsLocal();
    const config = this.frontasticContext?.project?.configuration?.preBuy;

    const queryArgs = where
      ? {
          where,
        }
      : {};

    try {
      return this.getApiForProject()
        .stores()
        .get({
          queryArgs,
        })
        .execute()
        .then((response) => {
          return response.body.results.map((store) => mapCommercetoolsStoreToStore(store, locale.language, config));
        });
    } catch (e) {
      console.log(e);

      throw '';
    }
  };
}
