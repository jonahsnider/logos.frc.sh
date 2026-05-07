import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRoute, HeadContent, Outlet, ScriptOnce, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';
import { initPlausible } from '@/lib/plausible';
import { useTheme } from '@/lib/theme';
import appCss from '../styles.css?url';

const themeScript = `
(function() {
  try {
    var stored = window.localStorage.getItem('theme');
    var theme;
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.add(theme);
  } catch (e) {
    document.documentElement.classList.add('light');
  }
})();
`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ title: SITE_NAME },
			{ name: 'description', content: SITE_DESCRIPTION },
			{ name: 'theme-color', content: '#101211' },
			{ property: 'og:type', content: 'website' },
			{ property: 'og:site_name', content: SITE_NAME },
			{ property: 'og:title', content: SITE_NAME },
			{ property: 'og:description', content: SITE_DESCRIPTION },
			{ property: 'og:url', content: SITE_URL },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:title', content: SITE_NAME },
			{ name: 'twitter:description', content: SITE_DESCRIPTION },
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
		],
	}),

	shellComponent: RootDocument,
	component: RootLayout,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="min-h-screen">
				{children}
				<TanStackDevtools
					config={{ position: 'bottom-right' }}
					plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function RootLayout() {
	useTheme();

	useEffect(() => {
		initPlausible();
	}, []);

	return (
		<>
			<ScriptOnce>{themeScript}</ScriptOnce>
			<div className="container mx-auto max-w-6xl">
				<div className="flex flex-col gap-1 justify-start items-center min-h-screen p-4">
					<Header />
					<main className="w-full">
						<Outlet />
					</main>
					<Footer />
				</div>
			</div>
			<Toaster position="bottom-center" />
		</>
	);
}
