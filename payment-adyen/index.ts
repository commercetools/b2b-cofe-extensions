import * as AdyenActions from './actionControllers/AdyenController';
import { ExtensionRegistry } from '@frontastic/extension-types';

export default {
  actions: {
    adyen: AdyenActions,
  },
} as ExtensionRegistry;
