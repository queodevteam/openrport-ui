export default defineNuxtPlugin({
	name: 'color-mode',
	enforce: 'pre',
	setup() {
		const { init } = useColorMode();
		init();
	},
});
