import { Injectable } from '@angular/core'
import { SoundManagerService } from './soundManager.service'
import { ITrack, LayeredMusicTrack, Track} from 'app/shared/data/track'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { BooleanEmitter } from '../../../soundcommon/emitter/booleanEmitter'
import { WindowRefService } from './windowRef.service'
import { LogService } from './log.service'
import { LogType } from 'shared/enums/logType'
import { RandomNumber } from './randomNumber.service'
import { ByTracks, MyTracksService } from './myTracks.service'
import { PlayState } from '../enums/playState'

@Injectable({
	providedIn: 'root',
})
export class MusicService {
	readonly label = 'MusicService'
	private _selectedTrack: ITrack
	get selectedTrack() {
		return this._selectedTrack
	}

	nextSelectedTrack: ITrack
	private _byTracks!: ByTracks[]
	get byTracks() {
		return this._byTracks
	}
	private _playState = PlayState.Stopped
	get playState() {
		return this._playState
	}

	private _playStateChangeListener = () => {}

	private tracks: Track[]
	private _isShuffle = true
	get isShuffle() {
		return this._isShuffle
	}

	constructor(private soundManager: SoundManagerService, private windowRef: WindowRefService,  private myTracks: MyTracksService, private randomNumber: RandomNumber, private logService: LogService) {

		this.setupInstanceListeners()

		this.soundManager.instance.init(this.windowRef.nativeWindow, logService.log)

		this.myTracks.init()
		this._byTracks = myTracks.byTracks
		this.tracks = myTracks.flatTracks


		if (this._isShuffle) {
			randomNumber.startUniqueNumberTracking(this.tracks.length)
			this.nextSelectedTrack = this.tracks[randomNumber.generateUniqueRandomNumber()]
		} else {
			this.nextSelectedTrack = this.tracks[0]
		}

		this._selectedTrack = this.nextSelectedTrack
	}

	toggleShuffle() {
		this._isShuffle = !this._isShuffle
		if (this._isShuffle) {
			this.randomNumber.startUniqueNumberTracking(this.tracks.length)
		}
	}

	play(gainsDisabled: BooleanEmitter) {
		if (this._playState === PlayState.Loading) {
			return
		}
		this.stop()

		const track = this.nextSelectedTrack
		if (!this.soundManager.instance.hasSound(track.soundDatas[0].key)) {
			for (let i = 0; i < track.soundDatas.length; i++) {
				this.soundManager.instance.addSound(track.soundDatas[i])
				this.logService.log(LogType.Info, `[${this.label}]`, 'adding sounds')
			}
		}
		this._playState = PlayState.Loading
		track.play()()

		if (track instanceof LayeredMusicTrack) {
			track.layeredMusicController.gainsDisabled = gainsDisabled
		}

		this._selectedTrack = track
	}

	stop() {
		this.soundManager.instance.stopMusic()
		const track = this._selectedTrack
		if (track instanceof LayeredMusicTrack && track.layeredMusicController) {
			track.layeredMusicController.stop()
		}
		this.myTracks.instanceEndedListeners.forEach((listener) => listener(true, true))
		// this._isPlaying = false
	}

	nextTrack() {
		let nextIndex: number
		if (this._isShuffle) {
			nextIndex = this.randomNumber.generateUniqueRandomNumber()
		} else {
			nextIndex = this._selectedTrack.index + 1
		}

		this.logService.log(LogType.Info, 'nextIndex', nextIndex)

		this.nextSelectedTrack = this.tracks[nextIndex]

	}

	private setupInstanceListeners() {
		this.addInstancePlayedListener(`${this.label} playedListener`, (_soundInstance: SoundInstance) => {
			this._playState = PlayState.Playing
				// listener needs to be called here
				// as the seems view does not update when State is right away set from 'Loading' to 'Playing' (when no loading is needed)
			this._playStateChangeListener()
		})

		this.addInstanceEndedListener(`${this.label} endedListener`, (trackEnded?: boolean, _serviceDidStop?: boolean) => {
			if (this.myTracks.timeout) {
					clearTimeout(this.myTracks.timeout)
					this.myTracks.timeout = undefined
			}
			if (trackEnded) {
				this._playState = PlayState.Stopped
			}
		})
	}

	addInstancePlayedListener(name: string, listener: (soundInstance: SoundInstance) => void) {
		this.myTracks.instancePlayedListeners.set(name, listener)
	}

	addInstanceEndedListener(name: string, listener: (trackEnded?: boolean, serviceDidStop?: boolean) => void) {
		this.myTracks.instanceEndedListeners.set(name, listener)
	}

	addPlayStateChangeListener(listener: () => void) {
		this._playStateChangeListener = listener
	}

	removeInstancePlayedListener(name: string) {
		this.myTracks.instancePlayedListeners.delete(name)
	}

	removeInstanceEndedListener(name: string) {
		this.myTracks.instanceEndedListeners.delete(name)
	}

}
