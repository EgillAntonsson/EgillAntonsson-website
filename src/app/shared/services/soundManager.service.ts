import { Injectable } from '@angular/core'
import { SoundManagerMock } from '../../../soundcommon/soundManager.mock'
import { SoundManager } from 'soundcommon/soundManager'
import { SoundManagerImp } from 'soundcommon/soundManager'

@Injectable({
	providedIn: 'root',
})
export class SoundManagerService {
	private _instance: SoundManager
	public get instance(): SoundManager {
		return this._instance
	}

	constructor() {
		this._instance = new SoundManagerImp()
	}

	/**
	 * Should only be used for tests
	 */
	injectMocksForTests(soundManagerMock: SoundManagerMock) {
		this._instance = soundManagerMock
	}
}
