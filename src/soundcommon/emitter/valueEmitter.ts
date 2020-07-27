import { EventEmitter } from 'events'

export class ValueEmitter extends
EventEmitter {
	private _value: any
	public get value(): any {
		return this._value
	}
	public set value(value: any) {
		this._value = value
	}

	constructor(value: any) {
		super()
		this._value = value
	}
}
