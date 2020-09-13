import { GainWrapper } from '../wrapper/gainWrapper'
export class SoundInstance {
	readonly audioContext: AudioContext
	readonly sourceNode: AudioBufferSourceNode
	readonly analyzerNode: AnalyserNode
	readonly gainWrapper: GainWrapper
	readonly id: number

	constructor(audioContext: AudioContext, sourceNode: AudioBufferSourceNode, analyzerNode: AnalyserNode, gainWrapper: GainWrapper, id: number) {
		this.audioContext = audioContext
		this.sourceNode = sourceNode
		this.analyzerNode = analyzerNode
		this.gainWrapper = gainWrapper
		this.id = id
	}
}
