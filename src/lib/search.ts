import type { TeamLogo } from '@/data/teams';

export function filterTeams(teams: readonly TeamLogo[], query: string): readonly TeamLogo[] {
	const trimmed = query.trim().toLowerCase();
	if (!trimmed) {
		return teams;
	}

	return teams.filter((team) => String(team.number).includes(trimmed));
}
