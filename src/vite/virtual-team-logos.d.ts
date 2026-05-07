declare module 'virtual:team-logos' {
	export type DiscoveredTeamLogo = {
		readonly number: number;
		readonly light?: string;
		readonly dark?: string;
	};

	export const TEAM_LOGOS: readonly DiscoveredTeamLogo[];
}
