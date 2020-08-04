import { SoundType } from 'soundcommon/enum/soundType'
import { globalMaxNrPlayingAtOncePerSound, validateRange } from './soundUtil'
import { GainEmitter } from './emitter/gainEmitter'
import { GainWrapper } from './wrapper/gainWrapper'
import { DynamicRangeEmitter } from './emitter/dynamicRangeEmitter'
import { SoundInstance } from './interface/soundInstance'
import { SoundData } from './interface/soundData'

export class Sound {
	readonly maxGainValidated: number
	readonly maxNrPlayingAtOnceValidated: number
	readonly soundData: SoundData
	configMaxNrPlayingAtOnce: number
	private instances: Map<number, SoundInstance> = new Map()
	readonly audioCtx: AudioContext
	private log: (message?: any, ...optionalParams: any[]) => void
	private endedListener: EventListener
	private soundTypeGain: GainEmitter
	private masterGain: GainEmitter
	private dynamicRange: DynamicRangeEmitter
	private sourceNodeBuffer: AudioBuffer
	private id =  -1
	private endedCallback: () => void
	private _loaded = false
	public get loaded() {
		return this._loaded
	}
	private firstInstancePromise: Promise<SoundInstance>

	constructor(soundData: SoundData, configMaxNrPlayingAtOnce: number, soundTypeGain: GainEmitter, masterGain: GainEmitter, dynamicRange: DynamicRangeEmitter, audioCtx: AudioContext, log: (message?: any, ...optionalParams: any[]) => void) {
		this.audioCtx = audioCtx
		this.log = log
		this.soundData = soundData

		this.configMaxNrPlayingAtOnce = configMaxNrPlayingAtOnce
		if (this.soundData.maxNrPlayingAtOnce) {
			this.maxNrPlayingAtOnceValidated = validateRange(this.soundData.maxNrPlayingAtOnce, 0, globalMaxNrPlayingAtOncePerSound, this.log)
		} else {
			this.maxNrPlayingAtOnceValidated = this.soundData.loop ? 1 : globalMaxNrPlayingAtOncePerSound
		}

		this.maxGainValidated = validateRange(this.soundData.maxGain, 0, 1, this.log)
		this.soundTypeGain = soundTypeGain
		this.masterGain = masterGain
		this.dynamicRange = dynamicRange

		this.firstInstancePromise = this.createSoundInstance(true)

		// this.firstInstancePromise.then((soundInstance: SoundInstance) => {
		// 	console.log('inside loading promise.then, setting first instance')
		// 	this.firstInstance = soundInstance
		// 	if (!this.isPendingPlay) {
		// 		// const endedPromise = this.processEnded(soundInstance)
		// 		// this.playSoundInstance(soundInstance)
		// 		this.isPendingPlay = false
		// 	} else
		// 		this.firstInstance = soundInstance
		// 	}
		// 	this.firstInstancePromise = null
		// })
	}

	private reachedMaxNumberOfPlayingAtOnce(): boolean {
		return this.instances.size >= this.maxNrPlayingAtOnceValidated || this.instances.size >= this.configMaxNrPlayingAtOnce
	}

	get isPlaying(): boolean {
		return this.instances.size > 0
	}

	async play(connectTheNodes = true) {
		if (this.reachedMaxNumberOfPlayingAtOnce()) {
			this.log('Info', `Reached MaxNrPlayingAtOnce for sound with key '${this.soundData.key}'`)
			return
		}

		// if (endedCallback) {
			// this.endedCallback = endedCallback
		// }

		let instance: SoundInstance

		if (this.firstInstancePromise) {

			// return this.firstInstancePromise
			// return {sotundInstance: this.firstInstancePromise, endedPromise: endedPromise}

			this.log('Info', 'play(): awaiting first instance promise')
			instance = await this.firstInstancePromise
			this.log('Info', 'play(): done waiting for first instance promise')
			this.firstInstancePromise = null

		} else {
			this.log('Info', 'play(): awaiting createSoundInstance')
			instance = await this.createSoundInstance(connectTheNodes) // should never await
		}


		this.instances.set(this.id, instance)
		this.log('Info',  `Added soundInstance with id '${this.id}' to the instances list which now has the size '${this.instances.size}'`)

		const endedPromise = this.createEndedPromise(instance)
		this.playSoundInstance(instance)

		// return instance
		return {instance: instance, endedPromise: endedPromise}
	}

	private createEndedPromise(instance: SoundInstance) {
		return new Promise<SoundInstance>((resolve) => {
			this.endedListener = () => {
				this.log('Info', 'endedListener')
				this.disposeInstance(instance)

				resolve(instance)

				const success = this.instances.delete(instance.id)
				if (!success) {
					this.log('Warning', `deleting map with instance id '${instance.id}' as key failed`)
				}
				this.log('Info', `endedListener for key '${this.soundData.key}' with instance id '${instance.id}, list with new size ${this.instances.size}`)
			}

			instance.sourceNode.addEventListener('ended', this.endedListener)
		})

	}

	private playSoundInstance(instance: SoundInstance) {
		// check if context is in suspended state (because of browser autoplay policy)
		if (this.audioCtx.state === 'suspended') {
			this.audioCtx.resume()
		}

		// instance.paused = false
		instance.sourceNode.start()
	}

	// firstInstance is called from constructor, is meant for warmup loading and not to be played out
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
		this.log('Info',  `Creating sound instance for key '${this.soundData.key}' with id '${this.id}'`)
		// const instance: SoundInstanceInternal = {sourceNode, gainWrapper, analyzerNode, paused: true, id: this.id}
		const instance = new SoundInstance(this.audioCtx, sourceNode, analyzerNode, gainWrapper, this.id)

		// this.instances.set(this.id, instance)
		// this.log('Info',  `Added soundInstance with id '${this.id}' to the instances list which now has the size '${this.instances.size}'`)

		// this.endedListener = () => {
		// 	this.disposeInstance(instance)
		// 	const success = this.instances.delete(instance.id)
		// 	if (this.endedCallback) {
		// 		this.endedCallback()
		// 	}
		// 	if (!success) {
		// 		this.log('Warning', `deleting map with instance id '${instance.id}' as key failed`)
		// 	}
		// 	this.log('Info', `endedListener for key '${this.soundData.key}' with instance id '${instance.id}, list with new size ${this.instances.size}`)
		// }

		// sourceNode.addEventListener('ended', this.endedListener)

		return instance
	}

	private async loadSound(): Promise<AudioBuffer> {
		this.log('Info',  `Loading sound with key '${this.soundData.key}'`)
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
		// if (!instance.paused) {
			instance.sourceNode.stop()
			// instance.paused = true
		// }
		instance.gainWrapper.dispose()
		instance.sourceNode.disconnect()
		instance.analyzerNode.disconnect()
		return instance
	}

	dispose(): void {
		this.instances.forEach((instance: SoundInstance) => {
			this.disposeInstance(instance)
			// delete instance.gainWrapper
			// delete instance.sourceNode
		})
		this.instances.clear()
		this.soundTypeGain.removeAllListeners()
		this.masterGain.removeAllListeners()
		this.id = -1
	}
}
