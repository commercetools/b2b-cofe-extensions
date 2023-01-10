import {
    DynamicPageContext,
    DynamicPageRedirectResult,
    DynamicPageSuccessResult,
    ExtensionRegistry,
    Request,
  } from '@frontastic/extension-types';
  import { getLocale, getPath } from './utils/Request';
  import { ProductRouter } from './utils/ProductRouter';
  import { Product } from '@Types/product/Product';
  import { SearchRouter } from './utils/SearchRouter';
  import { Result } from '@Types/product/Result';
  import { CategoryRouter } from './utils/CategoryRouter';
  import dataSources from './dataSources';
  import { actions } from './actionControllers';
  import { BusinessUnitApi } from './apis/BusinessUnitApi';

  export default {
    'dynamic-page-handler': async (
      request: Request,
      context: DynamicPageContext,
    ): Promise<DynamicPageSuccessResult | DynamicPageRedirectResult | null> => {
      // Identify static page
      const staticPageMatch = getPath(request)?.match(
        /^\/(cart|checkout|wishlist|account|login|register|reset-password|thank-you)/,
      );

      if (staticPageMatch) {
        return {
          dynamicPageType: `frontastic${staticPageMatch[0]}`,
          dataSourcePayload: {},
          pageMatchingPayload: {},
        } as DynamicPageSuccessResult;
      }
      // Identify businessUnit page
      const b2bPageMatch = getPath(request)?.match(/^\/(business-unit|dashboard)/);
      if (b2bPageMatch) {
        let organization = request.sessionData?.organization;
        if (!organization.businessUnit && request.sessionData?.account?.accountId) {
          const businessUnitApi = new BusinessUnitApi(context.frontasticContext, getLocale(request));
          organization = await businessUnitApi.getOrganization(request.sessionData.account.accountId);
        }
        return {
          dynamicPageType: `b2b${b2bPageMatch[0]}`,
          dataSourcePayload: {
            organization: request.sessionData?.organization,
          },
          pageMatchingPayload: {
            organization: request.sessionData?.organization,
          },
        } as DynamicPageSuccessResult;
      }
      // Identify quote page
      const quotePageMatch = getPath(request)?.match(/^\/(quote-thank-you)/);
      if (quotePageMatch) {
        return {
          dynamicPageType: `b2b${quotePageMatch[0]}`,
          dataSourcePayload: {},
          pageMatchingPayload: {},
        } as DynamicPageSuccessResult;
      }
      // Identify Product Preview
      if (ProductRouter.identifyPreviewFrom(request)) {
        return ProductRouter.loadPreviewFor(request, context.frontasticContext).then((product: Product) => {
          if (product) {
            return {
              dynamicPageType: 'frontastic/product-detail-page',
              dataSourcePayload: {
                product: product,
                isPreview: true,
              },
              pageMatchingPayload: {
                product: product,
                isPreview: true,
              },
            };
          }

          // FIXME: Return proper error result
          return null;
        });
      }

      // Identify Product
      if (ProductRouter.identifyFrom(request)) {
        return ProductRouter.loadFor(request, context.frontasticContext).then((product: Product) => {
          if (product) {
            return {
              dynamicPageType: 'frontastic/product-detail-page',
              dataSourcePayload: {
                product: product,
              },
              pageMatchingPayload: {
                product: product,
              },
            };
          }

          // FIXME: Return proper error result
          return null;
        });
      }

      // Identify Search
      if (SearchRouter.identifyFrom(request)) {
        return SearchRouter.loadFor(request, context.frontasticContext).then((result: Result) => {
          if (result) {
            return {
              dynamicPageType: 'frontastic/search',
              dataSourcePayload: {
                totalItems: result.total,
                ...result,
              },
              pageMatchingPayload: {
                query: result.query,
              },
            };
          }

          // FIXME: Return proper error result
          return null;
        });
      }

      // Identify preview list
      if (CategoryRouter.identifyPreviewFrom(request)) {
        return CategoryRouter.loadPreviewFor(request, context.frontasticContext).then((result: Result) => {
          if (result) {
            return {
              dynamicPageType: 'frontastic/category',
              dataSourcePayload: {
                totalItems: result.total,
                items: result.items,
                facets: result.facets,
                previousCursor: result.previousCursor,
                nextCursor: result.nextCursor,
                category: getPath(request),
                isPreview: true,
              },
              pageMatchingPayload: {
                totalItems: result.total,
                items: result.items,
                facets: result.facets,
                previousCursor: result.previousCursor,
                nextCursor: result.nextCursor,
                category: getPath(request),
                isPreview: true,
              },
            };
          }

          // FIXME: Return proper error result
          return null;
        });
      }

      if (CategoryRouter.identifyFrom(request)) {
        return CategoryRouter.loadFor(request, context.frontasticContext).then((result: Result) => {
          if (result) {
            return {
              dynamicPageType: 'frontastic/category',
              dataSourcePayload: {
                totalItems: result.total,
                items: result.items,
                facets: result.facets,
                previousCursor: result.previousCursor,
                nextCursor: result.nextCursor,
                category: getPath(request),
              },
              pageMatchingPayload: {
                totalItems: result.total,
                items: result.items,
                facets: result.facets,
                previousCursor: result.previousCursor,
                nextCursor: result.nextCursor,
                category: getPath(request),
              },
            };
          }

          // FIXME: Return proper error result
          return null;
        });
      }
      const homePageMatch = getPath(request)?.match(/^\//);
      if (homePageMatch) {
        let organization = request.sessionData?.organization;
        if (!organization.businessUnit && request.sessionData?.account?.accountId) {
          const businessUnitApi = new BusinessUnitApi(context.frontasticContext, getLocale(request));
          organization = await businessUnitApi.getOrganization(request.sessionData.account.accountId);
        }

        return {
          dynamicPageType: `b2b/home`,
          dataSourcePayload: {
            organization: request.sessionData?.organization,
          },
          pageMatchingPayload: {
            organization: request.sessionData?.organization,
            businessUnit: request?.sessionData?.organization?.businessUnit?.topLevelUnit?.key,
            store: request?.sessionData?.organization?.store?.key,
          },
        } as DynamicPageSuccessResult;
      }

      return null;
    },
    'data-sources': dataSources,
    actions,
  } as ExtensionRegistry;
