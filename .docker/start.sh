#!/bin/bash

if [ ! -f "./src/@core/.env.test" ]; then
  cp ./src/@core/.env.test.exemple ./src/@core/.env.test
fi

npm install

tail -f /dev/null

# npm run start:dev
