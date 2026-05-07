import type { TeamLogo } from '@/data/teams';
import { LogoCard } from './logo-card';

type LogoGridProps = {
	teams: readonly TeamLogo[];
};

export function LogoGrid({ teams }: LogoGridProps) {
	if (teams.length === 0) {
		return (
			<div className="flex w-full items-center justify-center py-16 text-muted-foreground">No matching teams.</div>
		);
	}

	return (
		<div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
			{teams.map((team) => (
				<LogoCard key={team.number} team={team} />
			))}
		</div>
	);
}
