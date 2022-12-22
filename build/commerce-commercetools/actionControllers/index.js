"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
const AccountActions = require("./AccountController");
const ProductActions = require("./ProductController");
const CartActions = require("./CartController");
const WishlistActions = require("./WishlistController");
const ProjectActions = require("./ProjectController");
const StoreActions = require("./StoreController");
const BusinessUnitActions = require("./BusinessUnitController");
const CustomerActions = require("./CustomerController");
const QuoteActions = require("./QuoteController");
const DashboardActions = require("./DashboardController");
exports.actions = {
    account: AccountActions,
    cart: CartActions,
    customer: CustomerActions,
    product: ProductActions,
    wishlist: WishlistActions,
    project: ProjectActions,
    store: StoreActions,
    quote: QuoteActions,
    'business-unit': BusinessUnitActions,
    dashboard: DashboardActions,
};
//# sourceMappingURL=index.js.map