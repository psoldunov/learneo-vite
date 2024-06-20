import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'path';

export default defineConfig({
	logLevel: 'info',
	plugins: [cssInjectedByJsPlugin()],
	build: {
		rollupOptions: {
			input: 'viteflow/main.ts',
			output: {
				entryFileNames: 'main.js',
				assetFileNames: `[name].[ext]`,
			},
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'@pages': resolve(__dirname, './src/pages'),
			'@components': resolve(__dirname, './src/components'),
			'@styles': resolve(__dirname, './src/styles'),
			'@plugins': resolve(__dirname, './src/plugins'),
			'@functions': resolve(__dirname, './src/functions'),
			'@context': resolve(__dirname, './src/context'),
			'@data': resolve(__dirname, './data'),
		},
	},
});
