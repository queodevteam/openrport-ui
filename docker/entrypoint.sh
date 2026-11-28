#!/bin/sh
set -eu

escape() {
	printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

monitoring=false
case "${NUXT_PUBLIC_MONITORING_ENABLED:-false}" in
	true|TRUE|1) monitoring=true ;;
esac

# Drop legacy service workers/caches from the previous UI; otherwise soft reloads
# keep serving the old shell while hard reloads show the new one.
snippet="<script>window.__RPORT_CONFIG__={apiUrl:\"$(escape "${NUXT_API_URL:-}")\",monitoringEnabled:${monitoring},appEnv:\"$(escape "${NUXT_APP_ENV:-}")\"};</script><script>(function(){if(!('serviceWorker' in navigator))return;navigator.serviceWorker.getRegistrations().then(function(rs){return Promise.all(rs.map(function(r){return r.unregister()}))}).catch(function(){});if(window.caches&&caches.keys)caches.keys().then(function(keys){return Promise.all(keys.map(function(k){return caches.delete(k)}))}).catch(function(){});})();</script>"

for page in /usr/share/nginx/html/index.html /usr/share/nginx/html/200.html; do
	if [ -f "$page" ]; then
		awk -v snippet="$snippet" '
			!inserted && index($0, "<head>") { sub("<head>", "<head>" snippet); inserted = 1 }
			{ print }
		' "$page" > /tmp/rport-page.html
		mv /tmp/rport-page.html "$page"
	fi
done

exec "$@"
