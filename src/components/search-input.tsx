import { SearchIcon } from 'lucide-react';
import type { ChangeEventHandler } from 'react';
import { Input } from '@/components/ui/input';

type SearchInputProps = {
	value: string;
	onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		onChange(event.target.value);
	};

	return (
		<div className="relative w-full max-w-xl mx-auto">
			<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
			<Input
				type="search"
				placeholder="Search by team number"
				value={value}
				onChange={handleChange}
				autoFocus
				className="h-11 pl-10 pr-4 text-base"
			/>
		</div>
	);
}
