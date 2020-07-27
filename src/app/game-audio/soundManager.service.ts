import { Injectable } from '@angular/core'
import { SoundManager } from 'soundcommon/soundManager'

@Injectable({
	providedIn: 'root',
})

export class SoundManagerService {
	private _instance: SoundManager
	public get instance(): SoundManager {
		return this._instance
	}
	public set instance(value: SoundManager) {
		this._instance = value
	}

	constructor() {
		this.instance = new SoundManager()
	}
}
