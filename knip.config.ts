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

	ignoreDependencies: [
		// Used in vite.config.ts via plugin
		'@tanstack/router-plugin',
		// Used by shadcn/ui components for styling variants
		'class-variance-authority',
		// Base primitive used by shadcn/ui components added via the shadcn CLI
		'@base-ui/react',
		// Validation library used by shadcn/ui components (e.g. forms)
		'zod',
		// CLI for adding/updating shadcn/ui components
		'shadcn',
		// Cloudflare Workers CLI used for deployment
		'wrangler',
	],

	rules: {
		enumMembers: 'off',
	},
};

export default config;
