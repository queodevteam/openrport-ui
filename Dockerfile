# Build the SPA, then ship only the static files.
FROM node:20-alpine AS build

WORKDIR /src

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY . .

ENV NUXT_TELEMETRY_DISABLED=1

RUN yarn install --frozen-lockfile --network-timeout 600000 \
	&& NODE_ENV=production yarn generate \
	&& find .output/public -type f -name '*.map' -delete

FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /entrypoint.sh
COPY --from=build /src/.output/public /usr/share/nginx/html

RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
