/* eslint-disable @typescript-eslint/ban-types */
export type WithError<T extends {}> = T & {
  // '{}' can be replaced with 'any'
  error?: string;
  errorCode?: number;
};
