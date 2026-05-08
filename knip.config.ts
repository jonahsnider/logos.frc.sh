import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	entry: [
		// TanStack Start/Router routes
		'src/routes/**/*.tsx',
		// TanStack Start router factory (referenced by routeTree.gen.ts)
		'src/router.tsx',
		// Vite plugin for team logos
		'src/vite/logos-plugin.ts',
	],

	project: ['src/**/*.{ts,tsx,css}'],

	ignore: ['src/components/**'],

	ignoreDependencies: [
		// Used in vite.config.ts via plugin
		'@tanstack/router-plugin',
		// Validation library used by shadcn/ui components (e.g. forms)
		'zod',
		// Cloudflare Workers CLI used for deployment
		'wrangler',
	],

	rules: {
		enumMembers: 'off',
	},
};

export default config;
