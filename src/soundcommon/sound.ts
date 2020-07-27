import { SoundType } from 'soundcommon/enum/soundType'
import { globalMaxNrPlayingAtOncePerSound, validateRange } from './soundUtil'
import { GainEmitter } from './emitter/gainEmitter'
import { GainWrapper } from './wrapper/gainWrapper'
import { DynamicRangeEmitter } from './emitter/dynamicRangeEmitter'
import { SoundInstance } from './interface/soundInstance'
import { SoundData } from './interface/soundData'

interface SoundInstanceInternal {
	sourceNode: AudioBufferSourceNode
	gainWrapper: GainWrapper
	analyzerNode: AnalyserNode
	paused: boolean
	id: number
}

export class Sound {
	// readonly url: string
	// readonly key: string
	// readonly soundType: SoundType
	// readonly loop: boolean
	readonly maxGainValidated: number
	readonly maxNrPlayingAtOnceValidated: number
	readonly soundData: SoundData
	configMaxNrPlayingAtOnce: number
	private instances: Map<number, SoundInstanceInternal> = new Map()
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

	// tslint:disable-next-line: max-line-length
	constructor(soundData: SoundData, configMaxNrPlayingAtOnce: number, soundTypeGain: GainEmitter, masterGain: GainEmitter, dynamicRange: DynamicRangeEmitter, audioCtx: AudioContext, log: (message?: any, ...optionalParams: any[]) => void) {
		this.audioCtx = audioCtx
		this.log = log
		// this.url = url
		// this.key = key
		// this.soundType = soundType
		// this.loop = loop
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

		// Need to create and connect the nodes because else there will be a delay in the first soundInstance playing, for example delaying sound to in another sound endedCallback
		// It also makes sure that soundInstance.source.buffer is not null
		this.createSoundInstance(true, true)
	}

	private reachedMaxNumberOfPlayingAtOnce(): boolean {
		return this.instances.size >= this.maxNrPlayingAtOnceValidated || this.instances.size >= this.configMaxNrPlayingAtOnce
	}

	get isPlaying(): boolean {
		return this.instances.size > 0
	}

	play(endedCallback?: () => void, connectTheNodes = true): SoundInstance {
		if (endedCallback) {
			this.endedCallback = endedCallback
		}

		if (this.reachedMaxNumberOfPlayingAtOnce()) {
			this.log('Info', `Reached MaxNrPlayingAtOnce for sound with key '${this.soundData.key}'`)
			return
		}

		const instance = this.createSoundInstance(connectTheNodes, false)
		this.playSoundInstance(instance)
		return {source: instance.sourceNode, gainWrapper: instance.gainWrapper, analyzerNode: instance.analyzerNode, audioCtx: this.audioCtx}
	}

	private playSoundInstance(instance: SoundInstanceInternal) {
		// check if context is in suspended state (because of browser autoplay policy)
		if (this.audioCtx.state === 'suspended') {
			this.audioCtx.resume()
		}

		instance.paused = false
		instance.sourceNode.start()
	}

	private createSoundInstance(connectTheNodes: boolean, firstInstance: boolean) {
		const sourceNode = this.audioCtx.createBufferSource()
		if (this.sourceNodeBuffer) {
			sourceNode.buffer = this.sourceNodeBuffer
		} else {
			this.loadSound((buffer) => {
				sourceNode.buffer = this.sourceNodeBuffer = buffer
				this._loaded = true
			})
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
		const instance: SoundInstanceInternal = {sourceNode, gainWrapper, analyzerNode, paused: true, id: this.id}
		if (!firstInstance) {
			this.instances.set(this.id, instance)
			this.log('Info',  `Added sound instance to the list with new size '${this.instances.size}'`)
		}

		this.endedListener = () => {
			this.disposeInstance(instance)
			const success = this.instances.delete(instance.id)
			if (this.endedCallback) {
				this.endedCallback()
			}
			if (!success) {
				this.log('Warning', `deleting map with instance id '${instance.id}' as key failed`)
			}
			this.log('Info', `endedListener for key '${this.soundData.key}' with instance id '${instance.id}, list with new size ${this.instances.size}`)
		}

		sourceNode.addEventListener('ended', this.endedListener)

		return instance
	}

	private loadSound(decodeCallback?: (buffer: AudioBuffer) => void) {
		this.log('Info',  `Loading sound with key '${this.soundData.key}'`)
		const request = new XMLHttpRequest()
		request.open('GET', this.soundData.url, true)
		request.responseType = 'arraybuffer'
		request.onload = () => {
			const audioData = request.response
			this.audioCtx.decodeAudioData(audioData, decodeCallback, (error) => {
				this.log('Error', `Decoding audio data had error '${error}`)
			})
		}
		request.send()
	}

	stop(): void {
		if (!this.isPlaying) {
			return
		}
		this.instances.forEach((instance: SoundInstanceInternal) => {
			this.disposeInstance(instance)
		})
		this.instances.clear()
		this.id = -1
	}

	private disposeInstance(instance: SoundInstanceInternal) {
		instance.sourceNode.removeEventListener('ended', this.endedListener)
		if (!instance.paused) {
			instance.sourceNode.stop()
			instance.paused = true
		}
		instance.gainWrapper.gainNode.disconnect()
		instance.sourceNode.disconnect()
		return instance
	}

	dispose(): void {
		this.instances.forEach((inst: SoundInstanceInternal) => {
			this.disposeInstance(inst)
			delete inst.gainWrapper
			delete inst.sourceNode
		})
		this.instances.clear()
		this.soundTypeGain.removeAllListeners()
		this.masterGain.removeAllListeners()
		this.id = -1
	}
}
