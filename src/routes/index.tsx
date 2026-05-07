import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { LogoGrid } from '@/components/logo-grid';
import { SearchInput } from '@/components/search-input';
import { TEAMS } from '@/data/teams';
import { filterTeams } from '@/lib/search';

export const Route = createFileRoute('/')({
	component: HomePage,
});

function HomePage() {
	const [query, setQuery] = useState('');

	const teams = useMemo(() => filterTeams(TEAMS, query), [query]);

	return (
		<div className="flex flex-col gap-6">
			<SearchInput value={query} onChange={setQuery} />
			<LogoGrid teams={teams} />
		</div>
	);
}
