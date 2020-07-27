import { Sound } from './sound'
import { SoundInstance } from './interface/soundInstance'
import { EmitterEvent } from './enum/emitterEvent'
import { BooleanEmitter } from './emitter/booleanEmitter'

export class LayeredMusicController {
	private layerSounds: Sound[]
	private startLayerIndexToBeDecremented: number
	private layerIndexToBeDecremented: number
	private timeIntervalSec: number
	private startCurrentLayerValue: number
	private currentLayerValue: number
	private maxLayerValue: number
	private fadeDurationSec: number
	private _layerSoundInstances: SoundInstance[];
	public get layerSoundInstances(): SoundInstance[] {
		return this._layerSoundInstances
	}
	private layerMusicTimer: NodeJS.Timeout
	private fadeOutTimeouts: Map<number, NodeJS.Timeout> = new Map()
	private fadeInTimeouts: Map<number, NodeJS.Timeout> = new Map()
	private gainsDisabled: BooleanEmitter
	private log: (message?: any, ...optionalParams: any[]) => void

	constructor(layerSounds: Sound[], gainsDisabled: BooleanEmitter, startLayerIndexToBeDecremented = 0, log: (message?: any, ...optionalParams: any[]) => void, timeIntervalSec = 15, startCurrentLayerValue = 0, maxLayerValue = 0, fadeDurationSec = 10) {
		this.layerSounds = layerSounds
		this.startLayerIndexToBeDecremented = startLayerIndexToBeDecremented
		this.timeIntervalSec = timeIntervalSec
		this.startCurrentLayerValue = startCurrentLayerValue
		this.maxLayerValue = maxLayerValue
		this.fadeDurationSec = fadeDurationSec
		this.gainsDisabled = gainsDisabled
		this.log = log
	}

	play(playCallback?: (instances: SoundInstance[]) => void) {
		this.layerIndexToBeDecremented = this.startLayerIndexToBeDecremented
		this.currentLayerValue = this.startCurrentLayerValue

		const readyGo = () => {
			let loaded = true
			this.layerSounds.forEach(layer => {
				loaded = layer.loaded
			})
			if (loaded) {
				this.log('ready')
				this._layerSoundInstances = []
				let instance: SoundInstance
				for (let i = 0; i < this.layerSounds.length; i++) {
					const layer = this.layerSounds[i]
					instance = layer.play()
					this._layerSoundInstances.push(instance)
				}
				if (playCallback) {
					playCallback(this._layerSoundInstances)
				}

				for (let i = this.layerIndexToBeDecremented + 1; i < this._layerSoundInstances.length; i++) {
					this._layerSoundInstances[i].gainWrapper.muteInstance()
				}

				this.setLayerMusicTimer()
				return true
			}
		}

		if (!readyGo()) {
			const readyTimer = setInterval(() => {
				this.log('load timer')
				if (readyGo()) {
					clearInterval(readyTimer)
				}
			}, 100)
		}
	}

	private setLayerMusicTimer() {
		this.layerMusicTimer = setInterval(() => {
			this.log('timer', this.currentLayerValue)

			if (0 < this.currentLayerValue) {
				--this.currentLayerValue
				this.log('decremented to value', this.currentLayerValue)
				return
			}
			if (0 < this.layerIndexToBeDecremented) {
				this.log('fading out index', this.layerIndexToBeDecremented)
				this.log('gainsDisable', this.gainsDisabled.value)

				if (!this.gainsDisabled.value) {
					this.gainsDisabled.value = true
					this.gainsDisabled.emit(EmitterEvent.Change, true)
				}
				const instance = this._layerSoundInstances[this.layerIndexToBeDecremented]
				instance.gainWrapper.cancelScheduledValues(0).linearRampToValueAtTime(0, instance.audioCtx.currentTime + this.fadeDurationSec)

				this.setFadeTimeout(this.fadeOutTimeouts, this.layerIndexToBeDecremented, instance)
				--this.layerIndexToBeDecremented
				this.currentLayerValue = this.maxLayerValue / 2
			}
		}, this.timeIntervalSec * 1000)
	}

	// private setFadeOutTimeout(instance: SoundInstance) {
	// 	this.fadeOutTimeouts.set(this.layerIndexToBeDecremented, setTimeout(() => {
	// 		this.log('onFadeOutTimeout, on time muting instance')
	// 		instance.gainWrapper.muteInstance()
	// 		if (this.gainsDisabled.value) {
	// 			this.gainsDisabled.value = false
	// 			this.gainsDisabled.emit(EmitterEvent.Change, false)
	// 		}
	// 	}, this.fadeDurationSec * 1000))
	// }

	// private setFadeInTimeout(instance: SoundInstance) {
	// 	this.fadeInTimeouts.set(this.layerIndexToBeDecremented, setTimeout(() => {
	// 		this.log('onFadeInTimeout, enabling')
	// 		this.log(this.gainsDisabled.value)
	// 		if (this.gainsDisabled.value) {
	// 			this.gainsDisabled.value = false
	// 			this.gainsDisabled.emit(EmitterEvent.Change, false)
	// 		}
	// 	}, this.fadeDurationSec * 1000))
	// }

	private setFadeTimeout(timeouts: Map<number, NodeJS.Timeout>, layerIndex: number, muteInstance?: SoundInstance) {
		timeouts.set(layerIndex, setTimeout(() => {
			this.log('onFadeTimeout')
			if (muteInstance) {
				muteInstance.gainWrapper.muteInstance()
			}
			this.log('timeouts.size before deleting key', [layerIndex, timeouts.size])
			timeouts.delete(layerIndex)
			if (timeouts.size === 0) {
				if (this.gainsDisabled.value) {
					this.gainsDisabled.value = false
					this.gainsDisabled.emit(EmitterEvent.Change, false)
				}
			}
		}, this.fadeDurationSec * 1000))
	}

	incrementLayerValue() {
		if (this.currentLayerValue < this.maxLayerValue) {
			++this.currentLayerValue
			this.log('incremented by 1 to value', this.currentLayerValue)
			return
		}
		this.log('clearing timer')
		clearInterval(this.layerMusicTimer)
		this.setLayerMusicTimer()
		if (this.layerIndexToBeDecremented < this._layerSoundInstances.length - 1) {
			++this.layerIndexToBeDecremented
			this.log('fading in index', this.layerIndexToBeDecremented)
			if (this.fadeOutTimeouts.has(this.layerIndexToBeDecremented)) {
				clearTimeout(this.fadeOutTimeouts.get(this.layerIndexToBeDecremented))
			}
			if (!this.gainsDisabled.value) {
				this.gainsDisabled.value = true
				this.gainsDisabled.emit(EmitterEvent.Change, true)
			}
			const inst = this._layerSoundInstances[this.layerIndexToBeDecremented]
			inst.gainWrapper.unmuteInstance(inst.gainWrapper.value).cancelScheduledValues(0).linearRampToValueAtTime(1, inst.audioCtx.currentTime + this.fadeDurationSec)
			this.setFadeTimeout(this.fadeInTimeouts, this.layerIndexToBeDecremented)
			this.currentLayerValue = this.maxLayerValue / 2
		}
	}

	stop() {
		clearInterval(this.layerMusicTimer)
		this.fadeOutTimeouts.forEach(value => {
			clearTimeout(value)
		})
		this.fadeInTimeouts.forEach(value => {
			clearTimeout(value)
		})
		this.fadeOutTimeouts.clear()
		this.fadeInTimeouts.clear()
	}


}
