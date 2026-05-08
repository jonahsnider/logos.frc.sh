import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Theme, useTheme } from '@/components/theme-provider';

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
		<Button
			variant="outline"
			size="icon"
			aria-label={`${LABELS[theme]} (click for ${LABELS[upcoming].toLowerCase()})`}
			title={LABELS[theme]}
			onClick={() => setTheme(upcoming)}
		>
			<Icon />
		</Button>
	);
}
