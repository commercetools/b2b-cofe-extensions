import { DataSourceConfiguration, DataSourceContext, ExtensionRegistry } from '@frontastic/extension-types';
import ContentfulApi from './apis/BaseApi';
import * as ContentfulActions from './actionControllers/ContenfulController';
import { getLocale } from './utils/Request';

export default {
  'data-sources': {
    'contentful/entries': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      const clientConfig = context.frontasticContext?.project.configuration.contentful;

      const contentfulApi = new ContentfulApi(
        { space: clientConfig.spaceId, accessToken: clientConfig.accessToken },
        getLocale(context.request),
      );

      return {
        dataSourcePayload: await contentfulApi.getEntries(),
      };
    },
    'contentful/entry': async (config: DataSourceConfiguration, context: DataSourceContext) => {
      const clientConfig = context.frontasticContext?.project.configuration.contentful;

      const contentfulApi = new ContentfulApi(
        { space: clientConfig.spaceId, accessToken: clientConfig.accessToken },
        getLocale(context.request),
      );

      return {
        dataSourcePayload: await contentfulApi.getEntry(config.configuration.entryId),
      };
    },
  },
  actions: {
    contentful: ContentfulActions,
  },
} as ExtensionRegistry;
