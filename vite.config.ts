import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite-plus';
import { cropLogoDirectory, teamLogosPlugin } from './src/vite/logos-plugin.ts';

const config = defineConfig(({ command }) => ({
	oxc: {
		jsx: {
			development: command !== 'build',
		},
	},
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
		nitro({
			preset: 'cloudflare-module',
			modules: [
				(nitro) => {
					nitro.hooks.hook('compiled', async () => {
						const cropped = await cropLogoDirectory(path.join(nitro.options.output.publicDir, 'logos'));
						if (cropped > 0) {
							console.log(`Cropped transparent padding from ${cropped} logo${cropped === 1 ? '' : 's'}.`);
						}
					});
				},
			],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
}));

export default config;
