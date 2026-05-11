FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG API_URL=/api
ENV API_URL=${API_URL}
RUN npx quasar build

FROM nginx:1.27-alpine
RUN apk add --no-cache openssl
COPY --from=build /app/dist/spa /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ssl-bootstrap.sh /docker-entrypoint.d/40-ssl-bootstrap.sh
RUN chmod +x /docker-entrypoint.d/40-ssl-bootstrap.sh
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
