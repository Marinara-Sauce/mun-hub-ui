#!/bin/bash

cd web

# Check if Buildkite environment variables are set
if [[ -z "$BUILDKITE_ENV_REACT_APP_API_URL" || -z "$BUILDKITE_ENV_REACT_APP_WS_URL" ]]; then
    echo "Error: Buildkite environment variables are not set."
    exit 1
fi

# Create or overwrite the .env file
echo "REACT_APP_API_URL=${BUILDKITE_ENV_REACT_APP_API_URL}" > .env
echo "REACT_APP_WS_URL=${BUILDKITE_ENV_REACT_APP_WS_URL}" >> .env

docker compose up -d app