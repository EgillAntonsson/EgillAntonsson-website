import { SoundType } from 'soundcommon/enum/soundType'

export class SoundData {
	readonly key: string
	readonly url: string
	readonly soundType: SoundType
	readonly maxGain: number
	readonly loop: boolean
	readonly maxNrPlayingAtOnce: number

	static music(key: string, url: string, maxGain: number = 1) {
		return new SoundData(key, url, maxGain, SoundType.Music, false, 1)
	}

	static musicLoop(key: string, url: string, maxGain: number = 1) {
		return new SoundData(key, url, maxGain, SoundType.Music, true, 1)
	}

	static sfx(key: string, url: string, maxGain: number) {
		return new SoundData(key, url, maxGain, SoundType.SFX, false, 1)
	}

	static sfxLoop(key: string, url: string, maxGain: number) {
		return new SoundData(key, url, maxGain, SoundType.SFX, true, 1)
	}

	/**
	 * @param maxNrPlayingAtOnce value '-1' means that the SoundManager's 'maxNrPlayingAtOncePerSound' config will be used for the associated sound object
	 */
	constructor(key: string, url: string, maxGain: number, soundType: SoundType, loop: boolean, maxNrPlayingAtOnce: number = 1) {
		this.key = key
		this.url = url
		this.maxGain = maxGain
		this.soundType = soundType
		this.loop = loop
		this.maxNrPlayingAtOnce = maxNrPlayingAtOnce
	}
}
