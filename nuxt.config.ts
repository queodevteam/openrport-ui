export default defineNuxtConfig({
	devtools: { enabled: process.env.NODE_ENV !== 'production' },
	sourcemap: false,

	css: [
		'~/assets/css/tailwind.css',
		'~/assets/css/prism-tomorrow.css',
	],

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},

	modules: [
		'@nuxt/icon',
		'@pinia/nuxt',
		'@nuxtjs/tailwindcss',
		'shadcn-nuxt',
		'nuxt-snackbar',
		'nuxt-headlessui',
		'@nuxt/eslint',
	],

	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
				semi: true,
			},
		},
	},

	shadcn: {
		componentDir: './components/ui',
	},

	snackbar: {
		bottom: true,
		duration: 3000,
	},

	headlessui: {
		prefix: 'Headless',
	},

	app: {
		head: {
			title: 'rport',

			link: [

			],
			script: [
				{
					key: 'color-mode',
					tagPriority: 'critical',
					innerHTML: '(function(){try{var stored=localStorage.getItem("color-mode");var dark=stored==="dark"||(stored!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var root=document.documentElement;root.classList.toggle("dark",dark);root.style.colorScheme=dark?"dark":"light";}catch(e){}})();',
				},
			],
			bodyAttrs: {
				class: 'min-h-screen h-full bg-gray-50 dark:bg-gray-800',
			},
		},
	},

	plugins: [
		// { src: '~/node_modules/@tabler/core/dist/js/tabler.min.js', mode: 'client' }
	],

	alias: {
		assets: '/<rootDir>/assets',
	},

	routeRules: {
		// '/': { redirect: '/dashboard' }
	},

	router: {
		options: {
			linkActiveClass: 'bg-sky-700',
			linkExactActiveClass: 'bg-sky-700',
		},
	},

	components: {
		dirs: [
			{
				path: '~/components',
				ignore: [
					'**/DeviceMonitoringTab.vue',
					'**/DeviceMetaDataTab.vue',
					'**/DeviceDocumentsTab.vue',
					'**/DeviceFilesTab.vue',
					'**/DeviceAuditTab.vue',
				],
			},
		],
	},

	runtimeConfig: {
		public: {
			appEnv: process.env.NUXT_APP_ENV,
			apiUrl: process.env.NUXT_API_URL,
			monitoringEnabled: process.env.NUXT_PUBLIC_MONITORING_ENABLED === 'true',
		},
	},

	ssr: false,
	compatibilityDate: '2025-03-25',
});
