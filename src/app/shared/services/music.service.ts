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
	private _awaitingFirstPlay = false

	get awaitingFirstPlay() {
		return this._awaitingFirstPlay
	}

	private _isPlaying = false
	get isPlaying() {
		return this._isPlaying
	}
	private timeout: NodeJS.Timeout | undefined
	readonly instancePlayedListeners: Map<string, (soundInstance: SoundInstance) => void>
	readonly instanceEndedListeners: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>
	private tracks: Track[]
	private _isShuffle = true
	get isShuffle() {
		return this._isShuffle
	}

	constructor(private soundManager: SoundManagerService, private windowRef: WindowRefService,  private myTracks: MyTracksService, private randomNumber: RandomNumber, private logService: LogService, ) {

		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
		this.setupInstanceListeners()

		this.soundManager.instance.init(this.windowRef.nativeWindow, logService.log)

		this.myTracks.init(this.instancePlayedListeners, this.instanceEndedListeners)
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
		if (this._awaitingFirstPlay) {
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
		this._awaitingFirstPlay = true
		track.play()()
		this._isPlaying = true

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
		this.instanceEndedListeners.forEach((listener) => listener(true, true))
		this._isPlaying = false
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
			this._awaitingFirstPlay = false
		})

		this.addInstanceEndedListener(`${this.label} endedListener`, (trackEnded?: boolean) => {
			if (this.timeout) {
					clearTimeout(this.timeout)
					this.timeout = undefined
			}
			if (trackEnded) {
				this._isPlaying = false
			}
		})
	}

	addInstancePlayedListener(name: string, listener: (soundInstance: SoundInstance) => void) {
		this.instancePlayedListeners.set(name, listener)
	}

	addInstanceEndedListener(name: string, listener: (trackEnded?: boolean, serviceDidStop?: boolean) => void) {
		this.instanceEndedListeners.set(name, listener)
	}

	removeInstancePlayedListener(name: string) {
		this.instancePlayedListeners.delete(name)
	}

	removeInstanceEndedListener(name: string) {
		this.instanceEndedListeners.delete(name)
	}

}
