import { Product } from '@Types/product/Product';
import { Context, Request } from '@frontastic/extension-types';
import { LineItem } from '@Types/cart/LineItem';
import { LineItem as WishlistItem } from '@Types/wishlist/LineItem';
export declare class ProductRouter {
    private static isProduct;
    static generateUrlFor(item: Product | LineItem | WishlistItem): string;
    static identifyFrom(request: Request): boolean;
    static identifyPreviewFrom(request: Request): boolean;
    static loadFor: (request: Request, frontasticContext: Context) => Promise<Product>;
    static loadPreviewFor: (request: Request, frontasticContext: Context) => Promise<Product>;
}
