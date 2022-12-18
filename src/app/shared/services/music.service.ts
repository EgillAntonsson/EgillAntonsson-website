import { Injectable } from '@angular/core'
import { SoundManagerService } from './soundManager.service'
import { ITrack, LayeredMusicTrack, Track, Artist} from 'app/shared/data/track'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { BooleanEmitter } from '../../../soundcommon/emitter/booleanEmitter'
import { WindowRefService } from './windowRef.service'
import { LogService } from './log.service'
import { LogType } from 'shared/enums/logType'
import { RandomNumber } from './randomNumber.service'
import { MyTracksService } from './myTracks.service'
import { PlayState } from '../enums/playState'
import { MusicStreamer } from './musicstreamer.service'

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

	private _byTracks!: Artist[]
	get byTracks() {
		return this._byTracks
	}

	setSelectTrackByRootUrl(rootUrl: string) {
		let track = this.myTracks.getTrackByRootUrl(rootUrl)
		if (track === undefined) {
			this.logService.log(LogType.Error, `could not get track by rootUrl ${rootUrl}, returning first track`)
			track = this.tracks[0]
		}
		this._selectedTrack = this.nextSelectedTrack = track

		// When navigating directly to track via url,
		// the shuffle is set to false, so a whole album can be advertised
		this._isShuffle = false

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

	constructor(private soundManager: SoundManagerService, private musicStreamer: MusicStreamer, private windowRef: WindowRefService,  private myTracks: MyTracksService, private randomNumber: RandomNumber, private logService: LogService) {
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

	initThirdPartyStreamer() {
		this.musicStreamer.initThirdPartyStreamer()
		if (this.getThirdPartyStreamUrl(this._selectedTrack) != '') {
			this.musicStreamer.load(this._selectedTrack.soundcloudUrl)
		}
	}

	private getThirdPartyStreamUrl(track: ITrack) {
		return track.soundcloudUrl;
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
		this._playState = PlayState.Loading

		this._selectedTrack = this.nextSelectedTrack

		if (this.getThirdPartyStreamUrl(this._selectedTrack) != '') {
			this.musicStreamer.play()
			this._playState = PlayState.Playing
		}
		else {
			this.playViaSoundManager(this._selectedTrack, gainsDisabled);
		}
	}

	private playViaSoundManager(track: ITrack, gainsDisabled: BooleanEmitter) {
		if (!this.soundManager.instance.hasSound(track.soundDatas[0].key)) {
			for (let i = 0; i < track.soundDatas.length; i++) {
				this.soundManager.instance.addSound(track.soundDatas[i])
				this.logService.log(LogType.Info, `[${this.label}]`, 'adding sounds')
			}
		}
		track.play()()
		if (track instanceof LayeredMusicTrack) {
			track.layeredMusicController.gainsDisabled = gainsDisabled
		}
	}

	stop() {
		if (this.getThirdPartyStreamUrl(this._selectedTrack) != '') {
			this.musicStreamer.pause()
			this._playState = PlayState.Stopped
		}
		else {
			this.stopViaSoundManager(this._selectedTrack)
		}
	}

	private stopViaSoundManager(track: ITrack) {
		this.soundManager.instance.stopMusic()
		if (track instanceof LayeredMusicTrack && track.layeredMusicController) {
			track.layeredMusicController.stop()
		}
		this.myTracks.instanceEndedListeners.forEach((listener) => listener(true, true))
	}

	nextTrack() {
		let nextIndex: number
		if (this._isShuffle) {
			nextIndex = this.randomNumber.generateUniqueRandomNumber()
		} else {
			nextIndex = this._selectedTrack.index === this.tracks.length - 1 ? 0 : this._selectedTrack.index + 1
		}

		this.logService.log(LogType.Info, 'nextIndex', nextIndex)

		this.nextSelectedTrack = this.tracks[nextIndex]
	}

	get masterGain() {
		return this.soundManager.instance.masterGain
	}

	set masterGain(value: number) {
		this.soundManager.instance.masterGain = value
	}

	public set masterMuted(muted: boolean) {
		this.soundManager.instance.masterMuted = muted
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
