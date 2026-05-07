let initialized = false;

export async function initPlausible() {
	if (initialized) {
		return;
	}

	const { init } = await import('@plausible-analytics/tracker');

	init({
		domain: 'logos.frc.sh',
	});

	initialized = true;
}
