import { Injectable } from '@angular/core'
import { SoundManagerMock } from '../../../soundcommon/soundManager.mock'
import { SoundManager } from 'soundcommon/soundManager'
import { SoundManagerImp } from 'soundcommon/soundManager'
import { ITrack, LayeredMusicTrack } from '../data/track'
import { BooleanEmitter } from 'soundcommon/emitter/booleanEmitter'

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

	playFromStart(track: ITrack, playerUiGainsDisabled: BooleanEmitter) {
		if (!this.instance.hasSound(track.soundDatas[0].key)) {
			for (let i = 0; i < track.soundDatas.length; i++) {
				this.instance.addSound(track.soundDatas[i])
			}
		}

		track.play()()

		if (track instanceof LayeredMusicTrack) {
			track.layeredMusicController.gainsDisabled = playerUiGainsDisabled
		}
	}

	play() {
		this.instance.resume()
	}

	stop(track: ITrack) {
		this.instance.stopMusic()

		if (track instanceof LayeredMusicTrack && track.layeredMusicController) {
			track.layeredMusicController.stop()
		}
	}

	/**
	 * Should only be used for tests
	 */
	injectMocksForTests(soundManagerMock: SoundManagerMock) {
		this._instance = soundManagerMock
	}
}
