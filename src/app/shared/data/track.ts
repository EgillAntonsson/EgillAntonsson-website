import { SoundData } from '../../../soundcommon/interface/soundData'
import { LayeredMusicController } from '../../../soundcommon/layeredMusicController'

export interface ITrack {
	readonly name: string
	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>
}

export class Track implements ITrack {
	readonly name: string
	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>


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

	constructor(name: string, soundDatas: SoundData[], play: () => () => Promise<void>) {
		this.name = name
		this.soundDatas = soundDatas
		this.play = play
	}
}

export class LayeredMusicTrack extends Track {
	layeredMusicController: LayeredMusicController
}

export class EmptyTrack implements ITrack {
	readonly name: string
	soundDatas: SoundData[]
	play: () => () => Promise<void>
	constructor(name: string) {
		this.name = name
		this.soundDatas = null
		this.play = null
	}
}
