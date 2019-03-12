FROM node:alpine as build-stage

WORKDIR /usr

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run start

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build-stage /usr/build .

ENTRYPOINT ["node", "-g", "daemon off;"]