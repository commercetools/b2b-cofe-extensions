import { Store as CommercetoolsStore } from '@commercetools/platform-sdk';
import { Store } from '@Types/store/store';
import { ClientConfig } from 'commerce-commercetools/interfaces/ClientConfig';

export const mapCommercetoolsStoreToStore = (
  store: CommercetoolsStore,
  locale: string,
  config: Record<string, string>,
): Store => {
  return {
    ...store,
    name: store.name?.[locale],
    isPreBuyStore: !!config ? store.custom?.fields?.[config.storeCustomField] : false,
  };
};
