# The SPA is static, so compile it on the machine that runs the build.
# The nginx image follows the target platform.
FROM --platform=$BUILDPLATFORM node:20-alpine AS build

WORKDIR /src

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY . .

ENV NUXT_TELEMETRY_DISABLED=1
# Bake defaults into the SPA. Runtime __RPORT_CONFIG__ (entrypoint) can still override.
ARG NUXT_API_URL=same-origin
ENV NUXT_API_URL=$NUXT_API_URL
ARG NUXT_PUBLIC_MONITORING_ENABLED=false
ENV NUXT_PUBLIC_MONITORING_ENABLED=$NUXT_PUBLIC_MONITORING_ENABLED
ARG NUXT_APP_ENV=production
ENV NUXT_APP_ENV=$NUXT_APP_ENV

RUN yarn install --frozen-lockfile --network-timeout 600000 \
	&& NODE_ENV=production yarn generate \
	&& find .output/public -type f -name '*.map' -delete

FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /entrypoint.sh
COPY --from=build /src/.output/public /usr/share/nginx/html

RUN chmod +x /entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
