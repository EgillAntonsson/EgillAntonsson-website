import { SoundUtil } from './soundUtil'
import { GainEmitter } from './emitter/gainEmitter'
import { GainWrapper } from './wrapper/gainWrapper'
import { DynamicRangeEmitter } from './emitter/dynamicRangeEmitter'
import { SoundInstance } from './interface/soundInstance'
import { SoundData } from './interface/soundData'
import { LogType } from '../shared/enums/logType'

export class Sound {
	readonly label = 'Sound'
	readonly maxGainValidated: number
	readonly maxNrPlayingAtOnceValidated: number
	readonly soundData: SoundData
	configMaxNrPlayingAtOnce: number
	private instances: Map<number, SoundInstance> = new Map()
	readonly audioCtx: AudioContext
	private log: (logType: LogType, msg?: any, ...rest: any[]) => void
	private endedListener!: EventListener
	private soundTypeGain: GainEmitter
	private masterGain: GainEmitter
	private dynamicRange: DynamicRangeEmitter
	private sourceNodeBuffer!: AudioBuffer
	private id =  -1
	private _loaded = false
	public get loaded() {
		return this._loaded
	}
	private firstInstancePromise?: Promise<SoundInstance>

	constructor(soundData: SoundData, configMaxNrPlayingAtOnce: number, soundTypeGain: GainEmitter, masterGain: GainEmitter, dynamicRange: DynamicRangeEmitter, audioCtx: AudioContext, log: (logType: LogType, msg?: any, ...rest: any[]) => void) {
		this.audioCtx = audioCtx
		this.soundData = soundData
		this.log = log

		this.configMaxNrPlayingAtOnce = configMaxNrPlayingAtOnce
		if (this.soundData.maxNrPlayingAtOnce) {
			this.maxNrPlayingAtOnceValidated = SoundUtil.validateNumberForRange(this.soundData.maxNrPlayingAtOnce, 0, configMaxNrPlayingAtOnce)
		} else {
			this.maxNrPlayingAtOnceValidated = this.soundData.loop ? 1 : configMaxNrPlayingAtOnce
		}

		this.maxGainValidated = SoundUtil.validateNumberForRange(this.soundData.maxGain, 0, 1)
		this.soundTypeGain = soundTypeGain
		this.masterGain = masterGain
		this.dynamicRange = dynamicRange

		// first instance is meant for warmup loading and not to be played out
		this.firstInstancePromise = this.createSoundInstance(true)
	}

	get reachedMaxNumberOfPlayingAtOnce(): boolean {
		return this.instances.size >= this.maxNrPlayingAtOnceValidated || this.instances.size >= this.configMaxNrPlayingAtOnce
	}

	get isPlaying(): boolean {
		return this.instances.size > 0
	}

	async play(connectTheNodes = true) {
		if (this.reachedMaxNumberOfPlayingAtOnce) {
			this.log(LogType.Warn, `Reached MaxNrPlayingAtOnce for sound with key '${this.soundData.key}'. Will play sound, but client code can check property 'reachedMaxNumberOfPlayingAtOnce'`)
		}

		let instance: SoundInstance

		if (this.firstInstancePromise) {
			this.log(LogType.Info, `[${this.label}]`, 'play(): awaiting first instance promise')
			instance = await this.firstInstancePromise
			this.firstInstancePromise = undefined
		}
		else {
			this.log(LogType.Info, `[${this.label}]`, 'play(): createSoundInstance')
			// Should never await / be async
			instance = await this.createSoundInstance(connectTheNodes)
		}

		this.instances.set(this.id, instance)
		this.log(LogType.Info,  `Added soundInstance with id '${this.id}' to the instances list which now has the size '${this.instances.size}'`)

		const endedPromise = this.createEndedPromise(instance)
		this.playSoundInstance(instance)

		return {instance, endedPromise}
	}

	private createEndedPromise(instance: SoundInstance) {
		return new Promise<SoundInstance>((resolve) => {
			this.endedListener = () => {
				this.log(LogType.Info, 'endedListener')
				this.disposeInstance(instance)

				resolve(instance)

				const success = this.instances.delete(instance.id)
				if (!success) {
					this.log(LogType.Warn, `deleting map with instance id '${instance.id}' as key failed`)
				}
				this.log(LogType.Info, `endedListener for key '${this.soundData.key}' with instance id '${instance.id}, list with new size ${this.instances.size}`)
			}

			instance.sourceNode.addEventListener('ended', this.endedListener)
		})

	}

	private playSoundInstance(instance: SoundInstance) {
		// INFO: checking if context is in suspended state (because of browser autoplay policy)
		if (this.audioCtx.state === 'suspended') {
			this.audioCtx.resume()
		}

		instance.sourceNode.start()
	}

	private async createSoundInstance(connectTheNodes: boolean) {
		const sourceNode = this.audioCtx.createBufferSource()

		if (this.sourceNodeBuffer) {
			sourceNode.buffer = this.sourceNodeBuffer
		} else {
			sourceNode.buffer = this.sourceNodeBuffer = await this.loadSound()
		}

		sourceNode.loop = this.soundData.loop

		const gainNode = this.audioCtx.createGain()
		const gainWrapper = new GainWrapper(gainNode, this.maxGainValidated, this.soundTypeGain, this.masterGain, this.dynamicRange, this.soundData.soundType, this.log)

		const analyzerNode = this.audioCtx.createAnalyser()

		if (connectTheNodes) {
			sourceNode.connect(gainWrapper.gainNode).connect(analyzerNode).connect(this.audioCtx.destination)
		}

		++this.id
		this.log(LogType.Info,  `Creating sound instance for key '${this.soundData.key}' with id '${this.id}'`)
		const instance = new SoundInstance(this.audioCtx, sourceNode, analyzerNode, gainWrapper, this.id)

		return instance
	}

	private async loadSound(): Promise<AudioBuffer> {
		this.log(LogType.Info, `Loading sound with key '${this.soundData.key}'`)
		const response = await fetch(this.soundData.url)
		const arrayBuffer = await response.arrayBuffer()
		const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer)
		return audioBuffer
	}

	stop(): void {
		if (!this.isPlaying) {
			return
		}
		this.instances.forEach((instance: SoundInstance) => {
			this.disposeInstance(instance)
		})
		this.instances.clear()
		this.id = -1
	}

	private disposeInstance(instance: SoundInstance) {
		instance.sourceNode.removeEventListener('ended', this.endedListener)
		instance.sourceNode.stop()
		instance.gainWrapper.dispose()
		instance.sourceNode.disconnect()
		instance.analyzerNode.disconnect()
		return instance
	}

	dispose(): void {
		this.instances.forEach((instance: SoundInstance) => {
			this.disposeInstance(instance)
		})
		this.instances.clear()
		this.soundTypeGain.removeAllListeners()
		this.masterGain.removeAllListeners()
		this.id = -1
	}
}
