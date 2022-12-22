import { ActionContext, Request } from '@frontastic/extension-types';
import { Cart } from '@Types/cart/Cart';
export declare class CartFetcher {
    static fetchCart(request: Request, actionContext: ActionContext): Promise<Cart>;
}
