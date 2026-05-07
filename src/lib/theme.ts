import { useCallback, useSyncExternalStore } from 'react';
import type { ResolvedTheme } from '@/data/teams';

export type Theme = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: unknown): value is Theme {
	return value === 'light' || value === 'dark' || value === 'system';
}

function getSystemTheme(): ResolvedTheme {
	if (typeof window === 'undefined') {
		return 'light';
	}
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStoredTheme(): Theme {
	if (typeof window === 'undefined') {
		return 'system';
	}
	try {
		const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
		return isTheme(raw) ? raw : 'system';
	} catch {
		return 'system';
	}
}

function applyResolvedTheme(resolved: ResolvedTheme) {
	const root = document.documentElement;
	root.classList.remove('light', 'dark');
	root.classList.add(resolved);
}

type ThemeState = {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
};

const initialState: ThemeState = {
	theme: 'system',
	resolvedTheme: 'light',
};

let state: ThemeState = initialState;
const listeners = new Set<() => void>();
let mediaQuery: MediaQueryList | null = null;
let mediaListener: (() => void) | null = null;

function emit() {
	for (const listener of listeners) {
		listener();
	}
}

function setState(next: ThemeState) {
	if (next.theme === state.theme && next.resolvedTheme === state.resolvedTheme) {
		return;
	}
	state = next;
	emit();
}

function ensureSystemListener(theme: Theme) {
	if (typeof window === 'undefined') {
		return;
	}
	if (theme === 'system') {
		if (mediaQuery && mediaListener) {
			return;
		}
		mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaListener = () => {
			if (state.theme !== 'system') {
				return;
			}
			const resolved: ResolvedTheme = mediaQuery?.matches ? 'dark' : 'light';
			applyResolvedTheme(resolved);
			setState({ theme: 'system', resolvedTheme: resolved });
		};
		mediaQuery.addEventListener('change', mediaListener);
	} else if (mediaQuery && mediaListener) {
		mediaQuery.removeEventListener('change', mediaListener);
		mediaQuery = null;
		mediaListener = null;
	}
}

let initialized = false;

function initializeFromStorage() {
	if (initialized || typeof window === 'undefined') {
		return;
	}
	initialized = true;
	const stored = readStoredTheme();
	const resolved = stored === 'system' ? getSystemTheme() : stored;
	applyResolvedTheme(resolved);
	ensureSystemListener(stored);
	setState({ theme: stored, resolvedTheme: resolved });
}

function subscribe(listener: () => void) {
	initializeFromStorage();
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

function getSnapshot(): ThemeState {
	return state;
}

function getServerSnapshot(): ThemeState {
	return initialState;
}

function setTheme(next: Theme) {
	try {
		if (next === 'system') {
			window.localStorage.removeItem(THEME_STORAGE_KEY);
		} else {
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
		}
	} catch {
		// ignore storage failures
	}
	const resolved: ResolvedTheme = next === 'system' ? getSystemTheme() : next;
	applyResolvedTheme(resolved);
	ensureSystemListener(next);
	setState({ theme: next, resolvedTheme: resolved });
}

export function useTheme() {
	const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	const setThemeStable = useCallback(setTheme, []);
	return { theme: snapshot.theme, resolvedTheme: snapshot.resolvedTheme, setTheme: setThemeStable };
}
