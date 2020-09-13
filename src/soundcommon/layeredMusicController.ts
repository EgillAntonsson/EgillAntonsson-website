import { Sound } from './sound'
import { SoundInstance } from './interface/soundInstance'
import { EmitterEvent } from './enum/emitterEvent'
import { BooleanEmitter } from './emitter/booleanEmitter'
import { LogType } from 'shared/enums/logType'

export class LayeredMusicController {
	readonly layerSounds: Sound[]
	private startLayerIndexToBeDecremented: number
	private layerIndexToBeDecremented: number
	private timeIntervalSec: number
	private startCurrentLayerValue: number
	private currentLayerValue: number
	private maxLayerValue: number
	private fadeDurationSec: number
	private lastLayerFadesOutAndStops: boolean
	private _layerSoundInstances: SoundInstance[];
	get layerSoundInstances(): SoundInstance[] {
		return this._layerSoundInstances
	}
	private layerMusicTimer: NodeJS.Timeout
	private fadeOutTimeouts: Map<number, NodeJS.Timeout> = new Map()
	private fadeInTimeouts: Map<number, NodeJS.Timeout> = new Map()
	private _gainsDisabled: BooleanEmitter
	private instanceEndedListeners: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>

	set gainsDisabled(value: BooleanEmitter) {
		this._gainsDisabled = value
	}
	private log = (_logType: LogType, _msg?: any, ..._rest: any[]) => {}

	// tslint:disable-next-line: max-line-length
	constructor(layerSounds: Sound[], startLayerIndexToBeDecremented = 3, timeIntervalSec = 15, fadeDurationSec = 10, lastLayerFadesOutAndStops = false, instanceEndedListeners: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>, startCurrentLayerValue = 0, maxLayerValue = 0) {
		this.layerSounds = layerSounds
		this.startLayerIndexToBeDecremented = startLayerIndexToBeDecremented
		this.timeIntervalSec = timeIntervalSec
		this.fadeDurationSec = fadeDurationSec
		this.lastLayerFadesOutAndStops = lastLayerFadesOutAndStops
		this.instanceEndedListeners = instanceEndedListeners

		this.startCurrentLayerValue = startCurrentLayerValue
		this.maxLayerValue = maxLayerValue
	}

	setLog(log: (logType: LogType, msg?: any, ...rest: any[]) => void) {
		this.log = log
	}

	start(soundInstances: SoundInstance[]) {
		this._layerSoundInstances = soundInstances

		this.layerIndexToBeDecremented = this.startLayerIndexToBeDecremented
		this.currentLayerValue = this.startCurrentLayerValue

		for (let i = this.layerIndexToBeDecremented + 1; i < this._layerSoundInstances.length; i++) {
			this._layerSoundInstances[i].gainWrapper.muteInstance()
		}

		this.setLayerMusicTimer()

	}

	private setLayerMusicTimer() {
		this.layerMusicTimer = setInterval(() => {
			this.log(LogType.Info, 'on timer: currentLayerValue', this.currentLayerValue)

			if (0 < this.currentLayerValue) {
				--this.currentLayerValue
				this.log(LogType.Info, 'decremented to value', this.currentLayerValue)
				return
			}
			if (this.lastLayerFadesOutAndStops || 0 < this.layerIndexToBeDecremented) {
				this.log(LogType.Info, 'fading out index', this.layerIndexToBeDecremented)

				if (!this._gainsDisabled.value) {
					this._gainsDisabled.value = true
					this._gainsDisabled.emit(EmitterEvent.Change, true)
				}
				const instance = this._layerSoundInstances[this.layerIndexToBeDecremented]
				instance.gainWrapper.cancelScheduledValues(0).linearRampToValueAtTime(0, instance.audioContext.currentTime + this.fadeDurationSec)

				this.setFadeTimeout(this.fadeOutTimeouts, this.layerIndexToBeDecremented, instance)
				--this.layerIndexToBeDecremented
				this.currentLayerValue = this.maxLayerValue / 2
			}
		}, this.timeIntervalSec * 1000)
	}

	private setFadeTimeout(timeouts: Map<number, NodeJS.Timeout>, layerIndex: number, muteInstance?: SoundInstance) {
		timeouts.set(layerIndex, setTimeout(() => {
			this.log(LogType.Info, 'onFadeTimeout')
			if (muteInstance) {
				muteInstance.gainWrapper.muteInstance()
			}
			timeouts.delete(layerIndex)
			if (timeouts.size === 0) {
				if (this._gainsDisabled.value) {
					this._gainsDisabled.value = false
					this._gainsDisabled.emit(EmitterEvent.Change, false)
				}
			}

			if (this.lastLayerFadesOutAndStops && layerIndex === 0) {
				this.instanceEndedListeners.forEach((listener) => listener(true))
			}

		}, this.fadeDurationSec * 1000))
	}

	incrementLayerValue() {
		if (this.currentLayerValue < this.maxLayerValue) {
			++this.currentLayerValue
			this.log(LogType.Info, 'incremented by 1 to value', this.currentLayerValue)
			return
		}
		this.log(LogType.Info, 'clearing timer')
		clearInterval(this.layerMusicTimer)
		this.setLayerMusicTimer()
		if (this.layerIndexToBeDecremented < this._layerSoundInstances.length - 1) {
			++this.layerIndexToBeDecremented
			this.log(LogType.Info, 'fading in index', this.layerIndexToBeDecremented)
			if (this.fadeOutTimeouts.has(this.layerIndexToBeDecremented)) {
				clearTimeout(this.fadeOutTimeouts.get(this.layerIndexToBeDecremented))
			}
			if (!this._gainsDisabled.value) {
				this._gainsDisabled.value = true
				this._gainsDisabled.emit(EmitterEvent.Change, true)
			}
			const inst = this._layerSoundInstances[this.layerIndexToBeDecremented]
			inst.gainWrapper.unmuteInstance(inst.gainWrapper.value).cancelScheduledValues(0).linearRampToValueAtTime(1, inst.audioContext.currentTime + this.fadeDurationSec)
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

		if (this._gainsDisabled.value) {
			this._gainsDisabled.value = false
			this._gainsDisabled.emit(EmitterEvent.Change, false)
		}
	}

}
