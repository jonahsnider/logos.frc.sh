import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { type Theme, useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

const ORDER: readonly Theme[] = ['system', 'light', 'dark'];

const LABELS: Record<Theme, string> = {
	system: 'System theme',
	light: 'Light theme',
	dark: 'Dark theme',
};

function nextTheme(current: Theme): Theme {
	const idx = ORDER.indexOf(current);
	return ORDER[(idx + 1) % ORDER.length];
}

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const upcoming = nextTheme(theme);

	const Icon = theme === 'light' ? SunIcon : theme === 'dark' ? MoonIcon : MonitorIcon;

	return (
		<button
			type="button"
			aria-label={`${LABELS[theme]} (click for ${LABELS[upcoming].toLowerCase()})`}
			title={LABELS[theme]}
			onClick={() => setTheme(upcoming)}
			className={cn(
				'inline-flex size-9 items-center justify-center rounded-full',
				'bg-background text-foreground/80 ring-1 ring-foreground/10',
				'hover:bg-accent hover:text-foreground transition-colors',
			)}
		>
			<Icon className="size-4" />
		</button>
	);
}
