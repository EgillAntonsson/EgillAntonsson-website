import { SoundData } from '../../../soundcommon/interface/soundData'
import { LayeredMusicController } from '../../../soundcommon/layeredMusicController'

export interface ITrack {
	readonly name: string
	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>
	index: number
	by: string
}

export class Track implements ITrack {
	readonly name: string
	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>
	index!: number
	by!: string


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

	readonly layeredMusicController: LayeredMusicController
	constructor(name: string, soundDatas: SoundData[], play: () => () => Promise<void>, layeredMusicController: LayeredMusicController) {
		super(name, soundDatas, play)
		this.layeredMusicController = layeredMusicController
	}
}
