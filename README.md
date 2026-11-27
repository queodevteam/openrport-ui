<p align="center">
  <img width="100" height="100" src="./public/img/logo-small.svg" alt="OpenRport logo">
</p>

<h1 align="center">OpenRPort UI</h1>

<p align="center">Manage remote systems with ease — Nuxt 3 frontend for OpenRPort.</p>

## Requirements

- Node.js 20+ / Yarn 1.x (dev)
- Docker (production image)
- An OpenRPort (`rportd`) API

## Quick start (dev)

```bash
git clone git@github.com:queodevteam/openrport-ui.git
cd openrport-ui
cp .env.example .env
# set NUXT_API_URL to your rportd API, e.g. https://iot.console.queo.com.co
yarn install
yarn dev
```

For local CORS during development, allow your UI origin in `rportd.conf` `[api] cors`, or use the deploy stack with a same-origin proxy.

## Docker image

```bash
docker build \
  --build-arg NUXT_API_URL=same-origin \
  --build-arg NUXT_APP_ENV=production \
  -t openrport-ui:1.0.0 .
```

The image serves the SPA on **`:8080`**. At container start, `docker/entrypoint.sh` injects `window.__RPORT_CONFIG__` from:

- `NUXT_API_URL` (use `same-origin` behind an nginx `/api` proxy)
- `NUXT_APP_ENV`
- `NUXT_PUBLIC_MONITORING_ENABLED`

Orchestration (staging beside prod, pins, sync DB):  
[`queodevteam/openrport-deploy`](https://github.com/queodevteam/openrport-deploy)

## Configuration

| Variable | Meaning |
|----------|---------|
| `NUXT_API_URL` | API base URL, or `same-origin` |
| `NUXT_APP_ENV` | `staging` / `production` / … |
| `NUXT_PUBLIC_MONITORING_ENABLED` | `true` / `false` |

See `.env.example`.

## Release

Version lives in `package.json`. Tagging `vX.Y.Z` runs `.github/workflows/release.yml` (zip artifact + GitHub Release).

## Credits

- Design: [Johan Cabeza](https://github.com/cryptodev4)
