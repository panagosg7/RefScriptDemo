RefScript Playground
====================

RefScript project: https://github.com/UCSD-PL/refscript

Based on the the TypeScript Playground build on ace editor:

http://basarat.github.io/TypeScriptEditor/


## How to deploy

### Get Dependencies

    npm install
    bower install

### Build

#### Server (Express-server)

    cd server
    typings install
    tsc
    cd ..

#### RefScript

    git submodule update --init --recursive
    cd refscript
    stack build --fast
    cd ..


#### Client

    cd scripts
    typings install
    tsc
    cd ..


### Start server

    nodemon server/index.js
