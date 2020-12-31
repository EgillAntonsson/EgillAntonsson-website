import { validateRange } from '../soundUtil'
import { DynamicRangeEmitter } from '../emitter/dynamicRangeEmitter'
import { GainEmitter } from '../emitter/gainEmitter'
import { EmitterEvent } from 'soundcommon/enum/emitterEvent';
import { SoundType } from 'soundcommon/enum/soundType'

export class GainWrapper implements AudioParam {

	public get automationRate(): AutomationRate {
		return this._gainNode.gain.automationRate
	}
	public get defaultValue(): number {
		return this._gainNode.gain.defaultValue
	}

	public get maxValue(): number {
		return this._gainNode.gain.maxValue
	}
	public get minValue(): number {
		return this._gainNode.gain.minValue
	}
	public get value(): number {
		return this._gainNode.gain.value
	}

	private soundType: SoundType
	private _instanceMuted = false
	public get instanceMuted() {
		return this._instanceMuted
	}

	private get muted(): boolean {
		return this.instanceMuted || this.soundTypeGain.muted || this.masterGain.muted
	}

	public set value(value: number) {
		// this.log('Info', `GainWrapper set value param: ${value}`)
		// this.log('Info', `GainWrapper get value before setting: ${this.value}`)

		this._gainNode.gain.value = this.muted ? 0 : this.calculateGain(validateRange(value, 0, 1, this.log))

		// this.log('Info', `GainWrapper value after setting: ${this.value}`)
	}
	private readonly _gainNode: GainNode
	public get gainNode(): AudioNode {
		return this._gainNode as AudioNode
	}
	private maxGain: number
	private soundTypeGain: GainEmitter
	private masterGain: GainEmitter
	private dynamicRange: DynamicRangeEmitter
	private log: (message?: any, ...optionalParams: any[]) => void

	constructor(gainNode: GainNode, maxGain: number, soundTypeGain: GainEmitter, masterGain: GainEmitter, dynamicRange: DynamicRangeEmitter, soundType: SoundType, log: (message?: any, optionalParams?: any[]) => void) {
		this.log = log
		this._gainNode = gainNode
		this.maxGain = maxGain
		this.soundTypeGain = soundTypeGain
		this.masterGain = masterGain
		this.dynamicRange = dynamicRange
		this.soundType = soundType
		this.value = this.defaultValue;

		[soundTypeGain, masterGain].forEach(gainEmitter => {
			gainEmitter.on(EmitterEvent.GainChange, () => {
				this.cancelScheduledValues(0)
				this.value = this.defaultValue
			})
			gainEmitter.on(EmitterEvent.MuteChange, () => {
				this.cancelScheduledValues(0)
				this.value = this.defaultValue
			})
		})

		this.dynamicRange.on(EmitterEvent.Change, () => {
			this.cancelScheduledValues(0)
			this.value = this.defaultValue
		})
	}

	private calculateGain(gain: number): number {
		// this.log('Info', `calculateGain gain: ${gain}`)
		// this.log('Info', `calculateGain maxGain: ${this.maxGain}`)
		// this.log('Info', `calculateGain soundTypeGain: ${this.soundTypeGain.value}`)
		// this.log('Info', `calculateGain masterGain: ${this.masterGain.value}`)
		const GainPreDR = gain * this.maxGain * this.soundTypeGain.value * this.masterGain.value
		if (GainPreDR === 0) {
			return 0
		}
		// dynamic Range applies only for SFX
		if (this.soundType === SoundType.SFX) {
			const rangeCenter = this.dynamicRange.getRangeCenter()
			// this.log('rangeCenter', rangeCenter)
			// this.log('getRange', this.dynamicRange.getRange())
			const calculatedGain = rangeCenter + (GainPreDR - 0.5) * this.dynamicRange.getRange()
			// this.log('Info', `calculateGain calculatedGain: ${calculatedGain}`)
			return calculatedGain
		} else {
			return GainPreDR
		}
	}

	muteInstance(): AudioParam {
		this._instanceMuted = true
		this.cancelScheduledValues(0)
		this.value = this.defaultValue
		return this
	}

	unmuteInstance(gainValue = 1): AudioParam {
		this._instanceMuted = false
		this.cancelScheduledValues(0)
		this.value = gainValue
		return this
	}

	setValueAtTime(value: number, startTime: number): AudioParam {
		if (this.muted) { return this }
		this._gainNode.gain.setValueAtTime(this.calculateGain(value), startTime)
		return this
	}

	exponentialRampToValueAtTime(value: number, endTime: number): AudioParam {
		if (this.muted) { return this }
		this._gainNode.gain.exponentialRampToValueAtTime(this.calculateGain(value), endTime)
		return this
	}

	linearRampToValueAtTime(value: number, endTime: number): AudioParam {
		if (this.muted) { return this._gainNode?.gain }
		this._gainNode.gain.linearRampToValueAtTime(this.calculateGain(value), endTime)
		return this
	}

	setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam {
		if (this.muted) { return this._gainNode.gain }
		this._gainNode.gain.setTargetAtTime(this.calculateGain(target), startTime, timeConstant)
		return this
	}

	setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): AudioParam {
		if (this.muted) { return this._gainNode.gain }
		for (let index = 0; index < values.length; index++) {
			values[index] = this.calculateGain(values[index])
		}
		this._gainNode.gain.setValueCurveAtTime(values, startTime, duration)
		return this
	}

	cancelScheduledValues(cancelTime: number): AudioParam {
		this._gainNode.gain.cancelScheduledValues(cancelTime)
		return this
	}

	cancelAndHoldAtTime(cancelTime: number): AudioParam {
		this._gainNode.gain.cancelAndHoldAtTime(cancelTime)
		return this
	}

	dispose() {
		[this.soundTypeGain, this.masterGain].forEach(gainEmitter => {
			gainEmitter.removeAllListeners(EmitterEvent.GainChange)
			gainEmitter.removeAllListeners(EmitterEvent.MuteChange)
		})

		this.cancelScheduledValues(0)
		this._gainNode.disconnect()
	}

}
