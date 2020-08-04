import { SoundData } from '../../../soundcommon/interface/soundData'
import { LayeredMusicController } from '../../../soundcommon/layeredMusicController'

export interface ITrack {
	readonly name: string
	readonly soundDatas?: SoundData[]
	readonly play?: (track: Track) => () => Promise<void>
	layeredMusicController?: LayeredMusicController
}

export class Track implements ITrack {
	readonly name: string
	readonly soundDatas: SoundData[]
	readonly play: (track: Track) => () => Promise<void>
	layeredMusicController?: LayeredMusicController


	///////
	// byBio?: string
	// indexWithinBy?: number
	// hasPlayedOnce?: boolean
	// description?: string
	// durationInSec?: number
	// artworkUrl?: string
	// purchaseUrl?: string
	// permalinkUrl?: string
	// liked?: number

	constructor(name: string, soundDatas: SoundData[], play: (track: Track) => () => Promise<void>) {
		this.name = name
		this.soundDatas = soundDatas
		this.play = play
	}
}

export class EmptyTrack implements ITrack {
	readonly name: string
	constructor(name: string) {
		this.name = name
	}
}
