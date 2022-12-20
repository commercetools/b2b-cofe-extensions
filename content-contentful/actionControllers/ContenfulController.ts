import { ActionContext, Request, Response } from '@frontastic/extension-types/src/ts/index';
import { getLocale } from '../utils/Request';
import ContentfulApi from '../apis/BaseApi';

export const getEntries = async (request: Request, actionContext: ActionContext) => {
  const config = actionContext.frontasticContext?.project.configuration.contentful;

  const api = new ContentfulApi({ space: config.spaceId, accessToken: config.accessToken }, getLocale(request));

  const data = await api.getEntries();

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };

  return response;
};

export const getEntry = async (request: Request, actionContext: ActionContext) => {
  const config = actionContext.frontasticContext?.project.configuration.contentful;

  const api = new ContentfulApi({ space: config.spaceId, accessToken: config.accessToken }, getLocale(request));

  const data = await api.getEntry(request.query.id);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };

  return response;
};
