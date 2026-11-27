# OpenRport UI Changelog

## [1.0.0] — 2026-11-27

### Added
- Docker image for the static UI (nginx on `:8080`) with runtime `window.__RPORT_CONFIG__` injection
- Same-origin `/api` proxy support for deploy beside rportd (avoids CORS `AllowedHeaders` limits)
- Durable login session via dedicated cookies + `localStorage` (safe next to legacy Secure cookies on the same host)
- Dark mode (system preference + remembered choice)
- Inventory cards, device tabs, multi-device commands, saved tunnels, and related console UX

### Fixed
- Login succeeding with HTTP 200 but not entering the app (token extract, navigation, session persistence)
- Cookie lifetime for “remember me” up to 3 months
- SPA shell on device page reload
- Tunnel creation errors surfaced in the UI

### Deploy notes
- Prefer `NUXT_API_URL=same-origin` and an edge proxy to rportd (see `openrport-deploy`)
- Staging agents can use `:1853` with a DB copy; production agents stay on `:853`

## Links
- [OpenRport](https://github.com/openrport/openrport)
- [Deploy compose](https://github.com/queodevteam/openrport-deploy)
