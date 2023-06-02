#!/bin/sh

npm run cti create './src/@seedwork/application' -- -i '*spec.ts' -b &&
npm run cti create './src/@seedwork/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/@seedwork/infra' -- -i '*spec.ts' -b

npm run cti create './src/user/application' -- -i '*spec.ts'  -b &&
npm run cti create './src/user/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/user/infra' -- -i '*spec.ts' -b

npm run cti create './src/auth/application' -- -i '*spec.ts'  -b &&
npm run cti create './src/auth/infra' -- -i '*spec.ts' -b

npm run cti create './src/card/application' -- -i '*spec.ts'  -b &&
npm run cti create './src/card/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/card/infra' -- -i '*spec.ts' -b

npm run cti create './src/deck/application' -- -i '*spec.ts'  -b &&
npm run cti create './src/deck/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/deck/infra' -- -i '*spec.ts' -b

npm run cti create './src/match/application' -- -i '*spec.ts'  -b &&
npm run cti create './src/match/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/match/infra' -- -i '*spec.ts' -b
