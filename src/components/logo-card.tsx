import { Image } from '@unpic/react';
import { CopyIcon, DownloadIcon, LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { resolveLogo, type ResolvedLogo, type TeamLogo } from '@/data/teams';
import { SITE_URL } from '@/lib/constants';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

type LogoCardProps = {
	team: TeamLogo;
};

function logoSrc(resolved: ResolvedLogo) {
	return `/logos/${resolved.file}`;
}

function absoluteLogoUrl(resolved: ResolvedLogo) {
	return `${SITE_URL}${logoSrc(resolved)}`;
}

async function copySvg(team: TeamLogo, resolved: ResolvedLogo) {
	if (resolved.format !== 'svg') {
		toast.error('SVG only', { description: `Team ${team.number} is a raster image.` });
		return;
	}

	try {
		const res = await fetch(logoSrc(resolved));
		const text = await res.text();
		await navigator.clipboard.writeText(text);
		toast.success('Copied SVG');
	} catch {
		toast.error('Failed to copy SVG');
	}
}

async function copyUrl(resolved: ResolvedLogo) {
	try {
		await navigator.clipboard.writeText(absoluteLogoUrl(resolved));
		toast.success('Copied URL');
	} catch {
		toast.error('Failed to copy URL');
	}
}

function downloadLogo(team: TeamLogo, resolved: ResolvedLogo) {
	const link = document.createElement('a');
	link.href = logoSrc(resolved);
	link.download = `frc-${team.number}.${resolved.format}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
	return (
		<button
			type="button"
			aria-label={label}
			onClick={onClick}
			className={cn(
				'inline-flex size-8 items-center justify-center rounded-full',
				'bg-background/80 backdrop-blur-sm text-foreground/80 ring-1 ring-foreground/10',
				'hover:bg-background hover:text-foreground transition-colors',
			)}
		>
			{children}
		</button>
	);
}

const TILE_CLASS: Record<ResolvedLogo['tile'], string> = {
	theme: 'bg-card',
	light: 'bg-white',
	dark: 'bg-stone-900',
};

export function LogoCard({ team }: LogoCardProps) {
	const { resolvedTheme } = useTheme();
	const resolved = resolveLogo(team, resolvedTheme);
	const isSvg = resolved.format === 'svg';
	const teamLabel = `Team ${team.number}`;

	return (
		<div className="group relative flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
			<div
				className={cn(
					'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl',
					TILE_CLASS[resolved.tile],
				)}
			>
				<Image
					src={logoSrc(resolved)}
					alt={teamLabel}
					width={512}
					aspectRatio={1}
					layout="constrained"
					className="max-h-[80%] max-w-[80%] object-contain"
				/>

				<div className="pointer-events-none absolute inset-0 flex items-end justify-end gap-1.5 p-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100">
					{isSvg && (
						<ActionButton label="Copy SVG" onClick={() => copySvg(team, resolved)}>
							<CopyIcon className="size-4" />
						</ActionButton>
					)}
					<ActionButton label="Copy URL" onClick={() => copyUrl(resolved)}>
						<LinkIcon className="size-4" />
					</ActionButton>
					<ActionButton label="Download" onClick={() => downloadLogo(team, resolved)}>
						<DownloadIcon className="size-4" />
					</ActionButton>
				</div>
			</div>

			<div className="flex flex-col gap-0.5">
				<span className="font-heading text-sm font-semibold tabular-nums">{teamLabel}</span>
			</div>
		</div>
	);
}
