import { ScriptOnce } from '@tanstack/react-router';
import { createContext, use, useEffect, useState } from 'react';
import type { ResolvedTheme } from '@/data/teams';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
};

function getThemeScript(storageKey: string, defaultTheme: Theme) {
	const key = JSON.stringify(storageKey);
	const fallback = JSON.stringify(defaultTheme);

	return `(function(){try{var t=localStorage.getItem(${key});if(t!=='light'&&t!=='dark'&&t!=='system'){t=${fallback}}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.classList.add(r);e.style.colorScheme=r}catch(e){}})();`;
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

function resolve(theme: Theme): ResolvedTheme {
	if (theme === 'system') {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
	return theme;
}

function applyTheme(resolved: ResolvedTheme) {
	const root = document.documentElement;
	root.classList.remove('light', 'dark');
	root.classList.add(resolved);
	root.style.colorScheme = resolved;
}

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'theme' }: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(defaultTheme);
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem(storageKey);
		setThemeState(stored === 'light' || stored === 'dark' || stored === 'system' ? stored : defaultTheme);
		setMounted(true);
	}, [defaultTheme, storageKey]);

	useEffect(() => {
		if (!mounted) {
			return;
		}
		const next = resolve(theme);
		applyTheme(next);
		setResolvedTheme(next);
	}, [theme, mounted]);

	useEffect(() => {
		if (!mounted || theme !== 'system') {
			return;
		}

		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const onChange = () => {
			const next = resolve('system');
			applyTheme(next);
			setResolvedTheme(next);
		};
		media.addEventListener('change', onChange);
		return () => media.removeEventListener('change', onChange);
	}, [theme, mounted]);

	const setTheme = (next: Theme) => {
		localStorage.setItem(storageKey, next);
		setThemeState(next);
	};

	return (
		<ThemeProviderContext value={{ theme, resolvedTheme, setTheme }}>
			<ScriptOnce>{getThemeScript(storageKey, defaultTheme)}</ScriptOnce>
			{children}
		</ThemeProviderContext>
	);
}

export function useTheme() {
	const context = use(ThemeProviderContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
