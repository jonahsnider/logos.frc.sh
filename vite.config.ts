import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite-plus';
import { teamLogosPlugin } from './src/vite/logos-plugin.ts';

const config = defineConfig({
	staged: {
		'*': 'vp check --fix',
	},
	fmt: {
		useTabs: true,
		singleQuote: true,
		printWidth: 120,
		ignorePatterns: ['src/components/**/*', '**/routeTree.gen.ts', '.output/**/*', '.nitro/**/*', '.wrangler/**/*'],
	},
	lint: {
		ignorePatterns: ['src/components/**/*', '**/routeTree.gen.ts', '.output/**/*', '.nitro/**/*', '.wrangler/**/*'],
	},
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		teamLogosPlugin(),
		devtools(),
		nitro({ preset: 'cloudflare-module' }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
