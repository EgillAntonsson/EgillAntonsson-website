import { SoundData } from '../../soundcommon/interface/soundData'
import { LayeredMusicController } from '../../soundcommon/layeredMusicController'
export interface Track {
	name: string
	soundDatas: SoundData[]
	play: (track: Track) => void
	layeredMusicController?: LayeredMusicController
	byBio?: string
	indexWithinBy?: number
	hasPlayedOnce?: boolean
	description?: string
	durationInSec?: number
	artworkUrl?: string
	purchaseUrl?: string
	permalinkUrl?: string
	liked?: number
}

export interface ByTracks {
	by: string
	tracks: Track[]
	byBio?: string
}
