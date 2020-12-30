import { SoundInstance } from './interface/soundInstance'
import { EmitterEvent } from './enum/emitterEvent'
import { BooleanEmitter } from './emitter/booleanEmitter'
import { LogType } from 'shared/enums/logType'

export class LayeredMusicController {

	private hasStarted = false
	private layerIndexToBeDecremented: number
	private currentLayerValue: number
	private fadeOutTimeouts: Map<number, NodeJS.Timeout> = new Map()
	private fadeInTimeouts: Map<number, NodeJS.Timeout> = new Map()

	private layerMusicTimer!: NodeJS.Timeout

	private _layerSoundInstances!: SoundInstance[]
	get layerSoundInstances(): SoundInstance[] {
		return this._layerSoundInstances
	}

	private _gainsDisabled!: BooleanEmitter
	set gainsDisabled(value: BooleanEmitter) {
		this._gainsDisabled = value
	}

	constructor(
			readonly instanceEndedListeners: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>,
			readonly log: (logType: LogType, msg?: any, ...rest: any[]) => void,
			readonly startLayerIndexToBeDecremented = 3,
			readonly timeIntervalSec = 30,
			readonly fadeDurationSec = 20,
			readonly lastLayerFadesOutAndStops = true,
			readonly startCurrentLayerValue = 0,
			readonly maxLayerValue = 0) {

		this.layerIndexToBeDecremented = startLayerIndexToBeDecremented
		this.currentLayerValue = startCurrentLayerValue
	}

	start(soundInstances: SoundInstance[]) {
		this._layerSoundInstances = soundInstances

		this.layerIndexToBeDecremented = this.startLayerIndexToBeDecremented
		this.currentLayerValue = this.startCurrentLayerValue

		for (let i = this.layerIndexToBeDecremented + 1; i < this._layerSoundInstances.length; i++) {
			this._layerSoundInstances[i].gainWrapper.muteInstance()
		}

		this.setLayerMusicTimer()

		this.hasStarted = true
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

				this.setGainsDisabledValue(true)

				const instance = this._layerSoundInstances[this.layerIndexToBeDecremented]
				instance.gainWrapper.cancelScheduledValues(0).linearRampToValueAtTime(0, instance.audioContext.currentTime + this.fadeDurationSec)

				this.setFadeTimeout(this.fadeOutTimeouts, this.layerIndexToBeDecremented, instance)
				--this.layerIndexToBeDecremented
				this.currentLayerValue = this.maxLayerValue / 2
			}
		}, this.timeIntervalSec * 1000)
	}

	private setGainsDisabledValue(value: boolean) {
		if (value && !this._gainsDisabled.value) {
			this._gainsDisabled.value = value
			this._gainsDisabled.emit(EmitterEvent.Change, value)
		}
	}

	private setFadeTimeout(timeouts: Map<number, NodeJS.Timeout>, layerIndex: number, muteInstance?: SoundInstance) {
		timeouts.set(layerIndex, setTimeout(() => {
			this.log(LogType.Info, 'onFadeTimeout')
			if (muteInstance) {
				muteInstance.gainWrapper.muteInstance()
			}
			timeouts.delete(layerIndex)

			if (timeouts.size === 0) {
				this.setGainsDisabledValue(false)
			}

			if (this.lastLayerFadesOutAndStops && layerIndex === 0) {
				this.instanceEndedListeners.forEach((listener) => listener(true))
			}

		}, this.fadeDurationSec * 1000))
	}

	incrementLayerValue() {
		if (!this.hasStarted) {
			return
		}

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

			const timeout = this.fadeOutTimeouts.get(this.layerIndexToBeDecremented)
				if (timeout) {
				clearTimeout(timeout)
			}

			this.setGainsDisabledValue(true)

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

		this.setGainsDisabledValue(false)
	}

}
