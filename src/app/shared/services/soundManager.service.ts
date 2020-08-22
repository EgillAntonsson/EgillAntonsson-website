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

	constructor() {
		this._instance = new SoundManager()
	}
}
