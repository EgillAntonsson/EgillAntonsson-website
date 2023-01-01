import { ElementRef, Injectable, OnDestroy } from '@angular/core'
import { SoundManagerService } from './soundManager.service'
import { ITrack, Track, Artist} from 'app/shared/data/track'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { BooleanEmitter } from '../../../soundcommon/emitter/booleanEmitter'
import { WindowRefService } from './windowRef.service'
import { LogService } from './log.service'
import { LogType } from 'shared/enums/logType'
import { RandomNumber } from './randomNumber.service'
import { MyTracksService } from './myTracks.service'
import { PlayState } from '../enums/playState'
import { MusicStreamer } from './musicStreamer.service'
import { YoutubeService } from './youtube.service'
import { StreamSource } from '../enums/streamSource'
import { MessageService, MessageType } from './message.service'
import { Subscription } from 'rxjs'
import { HtmlElementService } from './htmlElement.service'

@Injectable({
	providedIn: 'root',
})
export class MusicService implements OnDestroy {
	readonly label = 'MusicService'
	readonly urlPathRoot = 'music/'
	private _selectedTrack: ITrack
	get selectedTrack() {
		return this._selectedTrack
	}

	private playerUiGainsDisabled!: BooleanEmitter

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

	private subscription: Subscription

	private _playState = PlayState.Stopped
	get playState() {
		return this._playState
	}

	private _playStateChangeListener = () => {}

	private tracks: Track[]
	private _isShuffle = false
	get isShuffle() {
		return this._isShuffle
	}

	constructor(private soundManager: SoundManagerService, private musicStreamer: MusicStreamer, private youtubeService: YoutubeService, private windowRef: WindowRefService,  private myTracks: MyTracksService, private randomNumber: RandomNumber, private messageService: MessageService, private htmlService: HtmlElementService,private logService: LogService) {
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

		this.subscription = this.messageService.onMessage().subscribe(message => {
			if (message.type === MessageType.YoutubeVolumeChange) {
				this.setVolumeAndMutedFromYoutubePlayer()
			}
		})
	}

	ngOnDestroy(): void {
		if (this.subscription instanceof Subscription) {
			this.subscription.unsubscribe();
		}
	}

	sendYoutubePlayerElement(youtubeElement: ElementRef<any>) {
		this.youtubeService.savePlayerElement(youtubeElement)
	}

	onWindowInitSize(width: number, height: number) {
		this.youtubeService.onWindowInitSize(width, height)
	}

	onWindowResize(width: number, height: number) {
		if (this._selectedTrack.source == StreamSource.Youtube) {
			this.youtubeService.onWindowResize(width, height)
		} else {
			this.setHeaderContainerHeight()
		}
	}

	onYoutubePlayerReady(player: YT.Player) {
		this.youtubeService.onPlayerReady(player, this.masterGain * 100)
	}

	OnYoutubePlayerStateChange(playerState: YT.PlayerState) {
		console.log('OnYoutubePlayerStateChange', playerState)

		if (playerState === YT.PlayerState.PAUSED && this.playState !== PlayState.Paused) {
			this.pauseYoutube()
		}
		else if (playerState === YT.PlayerState.PLAYING && this.playState !== PlayState.Playing) {
			this.youtubeService.play()
		}
		else if (playerState === YT.PlayerState.ENDED) {
			this.nextTrack()
			this.playFromStart()
		}
	}

	private setHeaderContainerHeight() {
		let headerContainerElement = this.htmlService.get('headerContainer')
		let headerBackgroundElement = this.htmlService.get('headerBackground')

		// height has to match what is in styles.css and view calculation
		// nav tag is calculated height 35px
		// padding at top and add below player set to 22
		// .myPlayer height set to 25px in css + padding (9 + 7)
		let contHeight = 22 + 35 + 25 + 16

		headerContainerElement.value.nativeElement.style.height =  contHeight + 'px'
		headerBackgroundElement.value.nativeElement.style.height =  contHeight + 'px'
	}

	onYoutubeBtn() {
		this.youtubeService.toFullScreen()
	}


	initStreamer() {
		if (this.musicStreamer.isInitialized) {
			return;
		}
		this.musicStreamer.init()
		var streamUrl =  this.getStreamUrl(this._selectedTrack)
		if (streamUrl != '') {
			this.musicStreamer.load(streamUrl, false)
		}
	}

	playerUiInitialized(gainsDisabled: BooleanEmitter) {
		this.playerUiGainsDisabled = gainsDisabled
	}

	private getStreamUrl(track: ITrack) {
		return track.soundcloudUrl;
	}

	toggleShuffle() {
		this._isShuffle = !this._isShuffle
		if (this._isShuffle) {
			this.randomNumber.startUniqueNumberTracking(this.tracks.length)
		}
	}

	OnUiPlayOrPause() {
		switch (this.playState) {
			case PlayState.Playing:
				this.pause()
				break
			case PlayState.Paused:
				this.play()
			break
			case PlayState.Stopped:
				this.playFromStart()
			break
			case PlayState.Loading:
			default:
				return
		}
	}

	onUiNextTrack() {
		// this.stop() // ended listener will trigger next track appropriately

		this.nextTrack()
		this.playFromStart()
	}

	onUiTrackSelected(track: ITrack) {
		this.nextSelectedTrack = track
		this.playFromStart()
	}

	private play() {
		this.logService.log(LogType.Info, 'play() in MusicService')

		switch (this._selectedTrack.source) {
			case StreamSource.Youtube:
				this.youtubeService.play()
				break;
			case StreamSource.Soundcloud:
				this.musicStreamer.play()
				break;
			default:
				this.playViaSoundManager()
				break;
		}
	}

	private playViaSoundManager() {
		this.soundManager.play()
		// as my tracks fire stared event via play(), then for the case of pause and play before that we set it state to play
		this._playState = PlayState.Playing
	}

	playFromStart() {
		this.logService.log(LogType.Info, 'playFromStart() in MusicService')

		this.stop()

		this._playState = PlayState.Loading

		this._selectedTrack = this.nextSelectedTrack

		switch (this._selectedTrack.source) {
			case StreamSource.Youtube:
				this.youtubeService.playFromStart(this._selectedTrack)
				break;
			case StreamSource.Soundcloud:
				this.musicStreamer.playFromStart(this._selectedTrack)
				break;
			default:
				this.soundManager.playFromStart(this._selectedTrack, this.playerUiGainsDisabled)
				break;
		}

		this.setHeaderContainerHeight()
	}

	private pause() {
		this.logService.log(LogType.Info, 'pause() in MusicService')
		switch (this._selectedTrack.source) {
			case StreamSource.Youtube:
				this.pauseYoutube()
				break;
			case StreamSource.Soundcloud:
				this.pauseSoundcloud()
				break;
			default:
				this.soundManager.instance.pause()
				this._playState = PlayState.Paused
				break;
		}
	}

	private pauseYoutube() {
		this.youtubeService.pause()
		this._playState = PlayState.Paused
	}

	private pauseSoundcloud() {
		this.musicStreamer.pause()
		this._playState = PlayState.Paused
	}

	stop() {
		this.logService.log(LogType.Info, 'stop() in MusicService')
		switch (this._selectedTrack.source) {
			// At the moment youtube element has ngIf thus not needed to stop
			case StreamSource.Soundcloud:
				this.musicStreamer.pause()
				break;
				case StreamSource.Local:
				this.stopViaSoundManager()
				break;
		}

		this._playState = PlayState.Stopped
	}

	private stopViaSoundManager() {
		this.soundManager.stop(this._selectedTrack)
		this.myTracks.instanceEndedListeners.forEach((listener) => listener(true))
		// this.myTracks.instanceEndedListeners.forEach((listener) => listener(true, true))
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
			this.musicStreamer.volume = value * 100
			this.youtubeService.volume = value * 100
	}

	public get masterMuted() {
		return this.soundManager.instance.masterMuted
	}

	public set masterMuted(value: boolean) {
		this.soundManager.instance.masterMuted = value
		this.musicStreamer.muted = value
		this.youtubeService.muted = value
	}

	setVolumeAndMutedFromYoutubePlayer() {
		let volume = this.youtubeService.volume
		this.soundManager.instance.masterGain = volume / 100
		this.musicStreamer.volume = volume

		let muted = this.youtubeService.muted

		if (this.soundManager.instance.masterMuted === muted) {
			this.logService.log(LogType.Info, 'not updating mute with same value to avoid spam')
			return
		}
		this.soundManager.instance.masterMuted = muted
		this.musicStreamer.muted = muted
	}

	private setupInstanceListeners() {
		this.addInstancePlayedListener(`${this.label} playedListener`, (_soundInstance?: SoundInstance) => {
			this.onPlayed()
		})

		this.addInstanceEndedListener(`${this.label} endedListener`, (_trackEnded?: boolean, _serviceDidStop?: boolean) => {
			if (this.myTracks.timeout) {
					clearTimeout(this.myTracks.timeout)
					this.myTracks.timeout = undefined
			}
			// if (trackEnded) {
			// 	if (serviceDidStop) {
			// 		this._playState = PlayState.Stopped
			// 	}
			// 	else {
			// 		this.nextTrack()
			// 		this.playFromStart()
			// 	}
			// }
		})
	}

	private onPlayed() {
		this._playState = PlayState.Playing
				// listener needs to be called here
				// as the seems view does not update when State is right away set from 'Loading' to 'Playing' (when no loading is needed)
		this._playStateChangeListener()
	}

	addInstancePlayedListener(name: string, listener: (soundInstance?: SoundInstance) => void) {
		this.myTracks.instancePlayedListeners.set(name, listener)
		this.musicStreamer.instancePlayedListeners.set(name, listener)
		this.youtubeService.instancePlayedListeners.set(name, listener)
	}

	addInstanceEndedListener(name: string, listener: (trackEnded?: boolean, serviceDidStop?: boolean) => void) {
		this.myTracks.instanceEndedListeners.set(name, listener)
		this.musicStreamer.instanceEndedListeners.set(name, listener)
	}

	addPlayStateChangeListener(listener: () => void) {
		this._playStateChangeListener = listener
	}

	removeInstancePlayedListener(name: string) {
		this.myTracks.instancePlayedListeners.delete(name)
	}

	removeInstanceEndedListener(name: string) {
		this.myTracks.instanceEndedListeners.delete(name)
		this.musicStreamer.instanceEndedListeners.delete(name)
	}

}
