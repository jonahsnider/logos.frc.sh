import { Image } from '@unpic/react';
import { CopyIcon, DownloadIcon, LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { resolveLogo, type ResolvedLogo, type TeamLogo } from '@/data/teams';
import { SITE_URL } from '@/lib/constants';
import { useTheme } from '@/components/theme-provider';
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

const TILE_CLASS: Record<ResolvedLogo['tile'], string> = {
	theme: 'bg-card',
	light: 'bg-white',
	dark: 'bg-stone-900',
};

export function LogoCard({ team }: LogoCardProps) {
	const { resolvedTheme, themeReady } = useTheme();
	const resolved = resolveLogo(team, resolvedTheme);
	const isSvg = resolved.format === 'svg';
	const teamLabel = `Team ${team.number}`;
	const themeDependent = team.light !== team.dark;
	const visible = themeReady || !themeDependent;

	return (
		<Card className="group/logo-card flex-col gap-3 p-4 py-4">
			<div
				className={cn(
					'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl',
					visible ? TILE_CLASS[resolved.tile] : 'opacity-0',
					themeDependent && 'transition-opacity duration-200',
				)}
			>
				{visible && (
					<Image
						src={logoSrc(resolved)}
						alt={teamLabel}
						width={512}
						aspectRatio={1}
						layout="constrained"
						className="max-h-[80%] max-w-[80%] object-contain"
					/>
				)}

				<div className="pointer-events-none absolute inset-0 flex items-end justify-end gap-1.5 p-2 opacity-0 transition-opacity group-hover/logo-card:pointer-events-auto group-hover/logo-card:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100">
					{isSvg && (
						<Button variant="secondary" size="icon-sm" aria-label="Copy SVG" onClick={() => copySvg(team, resolved)}>
							<CopyIcon />
						</Button>
					)}
					<Button variant="secondary" size="icon-sm" aria-label="Copy URL" onClick={() => copyUrl(resolved)}>
						<LinkIcon />
					</Button>
					<Button variant="secondary" size="icon-sm" aria-label="Download" onClick={() => downloadLogo(team, resolved)}>
						<DownloadIcon />
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-0.5">
				<span className="font-heading text-sm font-semibold tabular-nums">{teamLabel}</span>
			</div>
		</Card>
	);
}
