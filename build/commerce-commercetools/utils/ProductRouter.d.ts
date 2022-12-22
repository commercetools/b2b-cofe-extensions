import { Product } from '../../../node_modules/@b2bdemo/types/build/product/Product';
import { Context, Request } from '@frontastic/extension-types';
import { LineItem } from '../../../node_modules/@b2bdemo/types/build/cart/LineItem';
import { LineItem as WishlistItem } from '../../../node_modules/@b2bdemo/types/build/wishlist/LineItem';
export declare class ProductRouter {
    private static isProduct;
    static generateUrlFor(item: Product | LineItem | WishlistItem): string;
    static identifyFrom(request: Request): boolean;
    static identifyPreviewFrom(request: Request): boolean;
    static loadFor: (request: Request, frontasticContext: Context) => Promise<Product>;
    static loadPreviewFor: (request: Request, frontasticContext: Context) => Promise<Product>;
}
