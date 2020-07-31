import { SoundData } from '../../soundcommon/interface/soundData'
import { LayeredMusicController } from '../../soundcommon/layeredMusicController'
import { SoundInstance } from 'soundcommon/interface/soundInstance';
export class Track {
	readonly name: string
	readonly soundDatas: SoundData[]
	readonly play: (track: Track) => void
	layeredMusicController?: LayeredMusicController
	// byBio?: string
	// indexWithinBy?: number
	// hasPlayedOnce?: boolean
	// description?: string
	// durationInSec?: number
	// artworkUrl?: string
	// purchaseUrl?: string
	// permalinkUrl?: string
	// liked?: number

	constructor(name: string, soundDatas: SoundData[], play: (track: Track) => void) {
		this.name = name
		this.soundDatas = soundDatas
		this.play = play
	}

	// play(cb: () => void) {
	// 	// this.playCb(this)
	// 	this.playPromise
	// }
}

export interface ByTracks {
	by: string
	tracks: Track[]
	byBio?: string
}

export interface PlayReturn {
	instance: SoundInstance
	endedPromise: Promise<SoundInstance>
}

