import { SoundType } from 'soundcommon/enum/soundType'
export interface SoundData {
	readonly url: string
	readonly key: string
	readonly soundType: SoundType
	readonly maxGain: number
	readonly loop: boolean
	maxNrPlayingAtOnce?: number
}
