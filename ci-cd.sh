#!/bin/bash
set -e

# Install npm dependencies
# npm ci

# Install skuid CLI
wget -q -O ./node_modules/.bin/skuid https://github.com/skuid/skuid/releases/download/0.3.8/skuid_linux_amd64
chmod +x ./node_modules/.bin/skuid

# deploy skuid metadata to the target skuid site
# ./node_modules/.bin/skuid deploy -d skuid-data

# Run tests
npm test