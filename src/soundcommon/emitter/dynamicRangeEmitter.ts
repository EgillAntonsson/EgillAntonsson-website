import { EventEmitter } from 'events'
export class DynamicRangeEmitter extends
EventEmitter {
	private _lowValue = 0
	public get lowValue(): number {
		return this._lowValue
	}
	public set lowValue(value: number) {
		this._lowValue = value
	}
	private _highValue = 1
	public get highValue(): number {
		return this._highValue
	}
	public set highValue(value: number) {
		this._highValue = value
	}

	constructor(lowValue: number, highValue: number) {
		super()
		this.lowValue = lowValue
		this.highValue = highValue
	}

	getRangeCenter(): number {
		return this.lowValue + (this.highValue - this.lowValue) / 2
	}

	getRange(): number {
		return this.highValue - this.lowValue
	}
}
