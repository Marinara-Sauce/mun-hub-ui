# Create or overwrite the .env file
echo "REACT_APP_API_URL=${BUILDKITE_ENV_REACT_APP_API_URL}" > .env
echo "REACT_APP_WS_URL=${BUILDKITE_ENV_REACT_APP_WS_URL}" >> .env

docker build -t web:latest ./web
docker save web:latest -o web-image.tar