# B2B Extensions
This repo serves as a central place for CoFe extensions. This repo is coupled with [Types](https://github.com/commercetools/b2b-cofe-types) repo

## How To Use
In order to use this package in your FE/BE app in a way that you can have the latest changes, you can use `git subtree` command.
You can read a bit more about `git subtree` in [here](https://www.atlassian.com/git/tutorials/git-subtree) or [here](https://gist.github.com/SKempin/b7857a6ff6bddb05717cc17a44091202)

### Adding B2B extensions to a new CoFe project
#### Prerequisites
1. You have a working CoFe env and access to git repo
1. Little or no modification is done in `packages/<name>/backend/commerce-commercetools`. All changes you have done under this dir will be removed unless you cherry-pick them after the process.

#### Steps
1. Remove `commerce-commercetools/` dir from `packages/<name>/backend`
1. Remove `types/` dir from `packages/<name>/`
1. Commit changes
    ```
    git add . && git commit -m"remove built-in extensions and types" 
    ```
1. Add `extensions` remote to your project
    ```
    git remote add extensions git@github.com:commercetools/b2b-cofe-extensions.git
    ```
1. Add `types` remote to your project
    ```
    git remote add types git@github.com:commercetools/b2b-cofe-types.git
    ```
1. Check if everything is in place
    ```sh
    git remote -v 
    ```
    Should respond like 
    ```sh
    extensions      git@github.com:commercetools/b2b-cofe-extensions.git (fetch)
    extensions      git@github.com:commercetools/b2b-cofe-extensions.git (push)
    origin  git@github.com:frontastic-developers/<your-repo-origin> (fetch)
    origin  git@github.com:frontastic-developers/<your-repo-origin> (push)
    types   git@github.com:commercetools/b2b-cofe-types.git (fetch)
    types   git@github.com:commercetools/b2b-cofe-types.git (push)
    ```
1. Fetch code from this repo into subtree
    ```
    git subtree add --prefix packages/<name>/extensions extensions master --squash
    ```
1. Fetch code from Types repo into subtree
    ```
    git subtree add --prefix packages/<name>/types types master --squash
    ```

1. Modify `packages/<name>/backend/webpack/webpack.common.js` to use `types` and `extensions` repo
    ```js
    export default {
        ...
        resolve: {
            extensions: ['.json', '.ts', '.js', '.ts'],
            alias: {
                '@Types': path.resolve(__dirname, '../../types/types/'),
                '@Extensions': path.resolve(__dirname, '../../extensions/'),
            }
        },
    }
    ```
1. Modify `packages/<name>/backend/tsconfig.json` to use `types` and `extensions` repo
    ```json
    {
        "compilerOptions": {
            ...
            "paths": {
                "@Types/*": ["../types/types/*"],
                "@Extensions/*" : ["../extensions/*"],
            },
            "typeRoots": [
                ...
                "../types/types"
            ],
        }
    }

    ```
1. Modify `packages/<name>/frontend/tsconfig.json` to use `types` and `extensions` repo
    ```json
    {
        "compilerOptions": {
            ...
            "paths": {
                "@Types/*": ["../types/types/*"],
            },
        }
    }

    ```
1. Modify `packages/<name>/backend/index.ts`
    ```ts
    import commercetoolsExtension from '@Extensions/index';
    ...
    ```
1. Modify `packages/<name>/frontend/package.json`
    ```json
    {
        ...
        "scripts": {
            "postinstall": "cd ../types && yarn install && cd ../extensions && yarn install",
            ...
        }
    }

    ```
1. Update imports in backend

    Some imports in `packages/<name>/backend` were using relative paths to access apis. Update these paths using the new `@Extensions` alias
    ```ts
    packages/<name>/backend/payment-adyen/actionControllers/AdyenController.ts
    
    ...
    import { CartApi } from '@Extensions/commerce-commercetools/apis/CartApi';
    import { EmailApi } from '@Extensions/commerce-commercetools/apis/EmailApi';
    import { isReadyForCheckout } from '@Extensions/commerce-commercetools/utils/Cart';
    ...
    ```
3. Add changes to repo
    ```
    git commit -m"<commit message>" && git push
    ```
1. `frontastic install`    

### Clone a project already using this repo
1. Clone the repo
    ```
    git clone <url>
    ```
1. Add remotes
    ```
    git remote add extensions git@github.com:commercetools/b2b-cofe-extensions.git
    git remote add types git@github.com:commercetools/b2b-cofe-types.git
    ```
1. Add changes (Optional)
    ```
    git commit -m"<commit message>" && git push
    ```

### Update extensions from a clone of this repo
Use `git commit` and `git push` 

### Update extensions from a project using this repo as a subtree
1. Commit the changes to the `origin` of your repo
1. If you have never pulled from `estensions` or `types` repos, you should pull first
    ```
    git subtree pull --prefix packages/<name>/extensions extensions master --squash
    git subtree pull --prefix packages/<name>/types types master --squash
    ```
1. Commit the changes to `extensions`
    
    ```
    git subtree push --prefix packages/<name>/extensions extensions <new-branch-name>
    ```
    Create a Pull Request from the <new-branch-name> to master in git@github.com:commercetools/b2b-cofe-extensions.git

## Extending CoFe without updating `extensions` repo
1. Create `packages/<name>/backend/commerce/index.ts` and create/override new extensions as needed.

    Here `updateLineItem` endpoint in the cart controller is overwritten

    ```ts
    packages/<name>/backend/commerce/index.ts

    export default {
        'actions': {
            cart: {
                updateLineItem: () => {
                    /// new code
                }
            }
        }
    } as ExtensionRegistry
    ```
1. Merge with other extensions
    `packages/<name>/backend/index.ts`
    ```ts
    ...
    import CommerceExtensions from './commerce';
    ...
    const extensionsToMerge = [commercetoolsExtension, adyenExtension, contentfulExtensions, CommerceExtensions] as Array<ExtensionRegistry>;

    ```

## variables to set
1. project.yml`
```
smtp:
    ...
preBuy:
    storeCustomType: lulu-store // name of the custom type on the store
    orderCustomType: lulu-order // name of the custom type on the cart/order
    storeCustomField: is-pre-buy-store // name of the field in the custome type. boolean field
    orderCustomField: is-created-from-pre-buy-store // boolean field in the custom type
wishlistSharing:
    wishlistSharingCustomType: b2b-list
    wishlistSharingCustomField: business-unit-keys // string(set) list of business units that can access this wishlist
```
