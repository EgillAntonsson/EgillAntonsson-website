import { ValueEmitter } from './valueEmitter'
export class GainEmitter extends
ValueEmitter {
	private _muted: boolean
	public get muted(): boolean {
		return this._muted
	}
	public set muted(muted: boolean) {
		this._muted = muted
	}

	constructor(value: number, muted: boolean) {
		super(value)
		this._muted = muted
	}
}
