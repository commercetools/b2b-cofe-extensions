# B2B CT
This repo serves as a central place for CoFe extensions

## How To Use
```
cd packages/<name>/backend
yarn add https://github.com/commercetools/b2b-demo-backend.git
```
open `packages/<name>/backend/indes.ts`
```
REPLACE
import commercetoolsExtension from './commerce-commercetools';
WITH
import commercetoolsExtension from '@b2bdemo/CT';

```