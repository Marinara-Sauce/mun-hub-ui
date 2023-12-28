# Stage 1 - the build process
FROM node:16.14.2 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

# Stage 2 - the production environment
FROM httpd:2.4

# Copy the built React app to the Nginx web root
COPY --from=build-deps /usr/src/app/build /usr/local/apache2/htdocs

EXPOSE 80
