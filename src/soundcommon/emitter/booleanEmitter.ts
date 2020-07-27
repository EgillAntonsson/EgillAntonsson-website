import { EventEmitter } from 'events'

export class BooleanEmitter extends
EventEmitter {
	private _value: boolean
	public get value(): boolean {
		return this._value
	}
	public set value(value: boolean) {
		this._value = value
	}

	constructor(value: boolean) {
		super()
		this._value = value
	}
}
