export function getSecondsPerBeat(beatsPerMinute: number): number {
	return 60 / beatsPerMinute;
}

export function getMillisecondsPerBeat(beatsPerMinute: number): number {
	return (60 / beatsPerMinute) * 1000;
}
