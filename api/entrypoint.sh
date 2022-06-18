#!/bin/bash
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=development
fi

cd /home/app
ls -la

nodemon index.js