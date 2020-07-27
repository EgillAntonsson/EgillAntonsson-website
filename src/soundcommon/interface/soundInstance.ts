import { GainWrapper } from '../wrapper/gainWrapper'
export interface SoundInstance {
	readonly source: AudioBufferSourceNode
	readonly gainWrapper: GainWrapper
	readonly analyzerNode: AnalyserNode
	readonly audioCtx: AudioContext
}
