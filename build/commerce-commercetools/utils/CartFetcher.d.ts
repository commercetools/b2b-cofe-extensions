import { ActionContext, Request } from '@frontastic/extension-types';
import { Cart } from '../../../node_modules/@b2bdemo/types/build/cart/Cart';
export declare class CartFetcher {
    static fetchCart(request: Request, actionContext: ActionContext): Promise<Cart>;
}
