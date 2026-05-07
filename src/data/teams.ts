import { TEAM_LOGOS } from 'virtual:team-logos';

export type ImageFormat = 'svg' | 'png' | 'jpg' | 'jpeg' | 'webp';

export type TeamLogo = {
	number: number;
	light?: string;
	dark?: string;
};

export type ResolvedTheme = 'light' | 'dark';

export type ResolvedLogo = {
	file: string;
	format: ImageFormat;
	tile: 'theme' | 'light' | 'dark';
};

function formatFromFile(file: string): ImageFormat {
	const ext = file.slice(file.lastIndexOf('.') + 1).toLowerCase();
	if (ext === 'svg' || ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') {
		return ext;
	}
	throw new RangeError(`Unsupported image format for file: ${file}`);
}

export function resolveLogo(team: TeamLogo, theme: ResolvedTheme): ResolvedLogo {
	const preferred = theme === 'dark' ? team.dark : team.light;
	if (preferred) {
		return { file: preferred, format: formatFromFile(preferred), tile: 'theme' };
	}
	const fallback = theme === 'dark' ? team.light : team.dark;
	if (fallback) {
		const tile: 'light' | 'dark' = team.light === fallback ? 'light' : 'dark';
		return { file: fallback, format: formatFromFile(fallback), tile };
	}
	throw new RangeError(`Team ${team.number} has no logo variants defined.`);
}

export const TEAMS: readonly TeamLogo[] = TEAM_LOGOS;
