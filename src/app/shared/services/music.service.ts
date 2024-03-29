import { ElementRef, Injectable, OnDestroy } from '@angular/core'
import { SoundManagerService } from './soundManager.service'
import { Track, Artist, LocalTrack, YoutubeTrack, RealtimeVisualTrack} from 'app/shared/data/track'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { BooleanEmitter } from '../../../soundcommon/emitter/booleanEmitter'
import { WindowRefService } from './windowRef.service'
import { LogService } from './log.service'
import { LogType } from 'shared/enums/logType'
import { RandomNumber } from './randomNumber.service'
import { MyTracksService } from './myTracks.service'
import { PlayState } from '../enums/playState'
import { MusicStreamer } from './musicstreamer.service'
import {RealtimeVisualService} from './realtimeVisual.service'
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
	private _selectedTrack: Track
	private windowWidth = 400
	private windowHeight = 300
	playerMargin: any
	get selectedTrack() {
		return this._selectedTrack
	}

	private playerUiGainsDisabled!: BooleanEmitter

	nextSelectedTrack: Track

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

		if (!this.isSelectedTrackWithActiveYoutubeVisuals) {
			this.setHeaderContainerHeightForMyPlayer()
		}
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

	constructor(private soundManager: SoundManagerService, private musicStreamer: MusicStreamer, private youtubeService: YoutubeService, private realtimeVisualService: RealtimeVisualService, private windowRef: WindowRefService,  private myTracks: MyTracksService, private randomNumber: RandomNumber, private messageService: MessageService, private htmlService: HtmlElementService, private logService: LogService) {
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

	init(youtubeElement: ElementRef<any>, webGlCanvasElement: ElementRef<any>) {
		this.youtubeService.savePlayerElement(youtubeElement)
		this.initSoundCloudStreamer()
		this.realtimeVisualService.init(webGlCanvasElement)
	}

	onWindowResize(width: number, height: number) {
		if (this._selectedTrack.source == StreamSource.RealtimeVisual) {
			var playerHeight = this.realtimeVisualService.onWindowResize(width, height)
			this.setHeaderContainerHeightForRealtimeVisual(playerHeight)
		}
		else if (this.isSelectedTrackWithActiveYoutubeVisuals) {
			let playerHeight = this.youtubeService.onWindowResize(width, height)
			this.setHeaderContainerHeight(playerHeight)
		} else {
			this.setHeaderContainerHeightForMyPlayer()
		}
		this.windowWidth = width
		this.windowHeight = height
	}

	get isSelectedTrackWithActiveYoutubeVisuals() {
		return this._selectedTrack.source == StreamSource.Youtube && (this._selectedTrack as YoutubeTrack).isGraphicsActive === true
	}

	private setHeaderContainerHeightForMyPlayer() {
		this.setHeaderContainerHeight(this.getMyPlayerHeight())
	}

	private getMyPlayerHeight() {
		// .myPlayer height set to 25px in css + padding (9 + 7)
		return 25 + 9 + 7
	}

	private setHeaderContainerHeightForRealtimeVisual(playerHeight: number) {
		const marginTop = 10 // 10px margin top like in the css
			const heightOffset = 3 // 3px offset for the border
			this.setHeaderContainerHeight(playerHeight + this.getMyPlayerHeight() + marginTop + heightOffset)
	}

	private setHeaderContainerHeight(height: number) {
		let headerContainerElement = this.htmlService.get('headerContainer')
		let headerBackgroundElement = this.htmlService.get('headerBackground')

		// height has to match what is in styles.css and view calculation
		// nav tag is calculated height 35px
		// padding at top and add below player set to 22
		height = height + 35 + 22;

		this.logService.log(LogType.Info, 'setHeaderContainerHeight', height)

		headerContainerElement.value.nativeElement.style.height =  height + 'px'
		headerBackgroundElement.value.nativeElement.style.height =  height + 'px'
	}

	onYoutubePlayerReady(player: YT.Player, windowWidth: number, windowHeight: number) {
		let playerHeight = this.youtubeService.onPlayerReady(player, this.masterGain * 100, this.isSelectedTrackWithActiveYoutubeVisuals, windowWidth, windowHeight)
		if (playerHeight > 0) {
			this.setHeaderContainerHeight(playerHeight)
		}
	}

	OnYoutubePlayerStateChange(playerState: YT.PlayerState) {
		if (this._selectedTrack.source !== StreamSource.Youtube) {
			return
		}
		if (playerState === YT.PlayerState.PAUSED && this.playState !== PlayState.Paused) {
			this.pause()
		}
		else if ((playerState === YT.PlayerState.PLAYING || playerState === YT.PlayerState.BUFFERING) && this.playState !== PlayState.Playing) {
			this.play()
		}
		else if (playerState === YT.PlayerState.ENDED) {
			this.NextTrackAndPlayFromStart()
		}
	}

	toggleMinimizeMusicPlayer(minimize: boolean) {
		if (this.selectedTrack.source === StreamSource.Youtube && (this.selectedTrack as YoutubeTrack).displayOnYoutube) {
			if (minimize) {
				this.setHeaderContainerHeightForMyPlayer()
			} else {
				let playerHeight = this.youtubeService.onWindowResize(this.windowWidth, this.windowHeight)
				this.setHeaderContainerHeight(playerHeight)
			}
			(this.selectedTrack as YoutubeTrack).isGraphicsActive = !minimize
		}
		if (this.selectedTrack.source === StreamSource.RealtimeVisual) {
			if (minimize) {
				this.setHeaderContainerHeightForMyPlayer()
			} else {
				let playerHeight = this.realtimeVisualService.onWindowResize(this.windowWidth, this.windowHeight)
				this.setHeaderContainerHeightForRealtimeVisual(playerHeight)
			}
			(this.selectedTrack as RealtimeVisualTrack).isGraphicsActive = !minimize
		}
	}

	initSoundCloudStreamer() {
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

	private getStreamUrl(track: Track) {
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
		// ended listener will trigger next track appropriately, thus no stop() done here
		this.nextTrack()
		this.playFromStart()
	}

	onUiTrackSelected(track: Track) {
		this.nextSelectedTrack = track
		this.playFromStart()
	}

	private playFromStart() {
		this.logService.log(LogType.Info, 'playFromStart() in MusicService')
		this.stop()
		this._playState = PlayState.Loading
		this._selectedTrack = this.nextSelectedTrack

		this.onWindowResize(this.windowWidth, this.windowHeight)

		switch (this._selectedTrack.source) {
			case StreamSource.Youtube:
				this.youtubeService.playFromStart(this._selectedTrack as YoutubeTrack)
				// if (this.isSelectedTrackWithActiveYoutubeVisuals) {
				// 	let playerHeight = this.youtubeService.onWindowResize(this.windowWidth, 0)
				// 	this.setHeaderContainerHeight(playerHeight)
				// } else {
				// 	this.setHeaderContainerHeightForMyPlayer()
				// }
				break
			case StreamSource.RealtimeVisual:
				this.playFromStartRealtimeVisual()
				break
			case StreamSource.Soundcloud:
				this.musicStreamer.playFromStart(this._selectedTrack)
				// this.setHeaderContainerHeightForMyPlayer()
				break
			case StreamSource.Local:
				this.playFromStartLocalPlayer()
				// this.setHeaderContainerHeightForMyPlayer()
				break
		}
	}

	private playFromStartRealtimeVisual() {
		// realtime visual will start playing when the audio has loaded and starts playing
		this.playFromStartLocalPlayer()
	}

	private playFromStartLocalPlayer() {
		this.soundManager.playFromStart(this._selectedTrack as LocalTrack, this.playerUiGainsDisabled)
	}

	private pause() {
		this.logService.log(LogType.Info, 'pause() in MusicService')
		switch (this._selectedTrack.source) {
			case StreamSource.Youtube:
				this.youtubeService.pause()
				break;
			case StreamSource.Soundcloud:
				this.musicStreamer.pause()
				break;
			case StreamSource.RealtimeVisual:
				this.pauseRealtimeVisual();
				break;
			default:
				this.pauseLocalPlayer();
				break;
		}
		this._playState = PlayState.Paused
	}

	private pauseRealtimeVisual() {
		this.realtimeVisualService.pause()
		this.pauseLocalPlayer();
	}

	private pauseLocalPlayer() {
		this.soundManager.instance.pause()
	}

	stop() {
		this.logService.log(LogType.Info, 'stop() in MusicService')
		switch (this._selectedTrack.source) {
			case StreamSource.Soundcloud:
				this.musicStreamer.pause()
				break;
			case StreamSource.RealtimeVisual:
				this.stopRealtimeVisual()
			break;
			case StreamSource.Local:
				this.stopLocalPlayer()
				break;
			case StreamSource.Youtube:
				this.youtubeService.pause()
				break;
		}

		this._playState = PlayState.Stopped
	}

	private stopRealtimeVisual() {
		this.realtimeVisualService.pause()
		this.stopLocalPlayer()
	}

	private stopLocalPlayer() {
		this.soundManager.stop(this._selectedTrack)
		this.myTracks.instanceEndedListeners.forEach((listener) => listener(false))
	}

	private play() {
		switch (this._selectedTrack.source) {
			case StreamSource.Youtube:
				this.youtubeService.play()
				break;
			case StreamSource.Soundcloud:
				this.musicStreamer.play()
				break;
			case StreamSource.RealtimeVisual:
				this.playRealtimeVisualPlayer()
				break;
			default:
				this.playLocalPlayer()
				break;
		}
	}

	private playRealtimeVisualPlayer() {
		this.realtimeVisualService.resume();
		this.playLocalPlayer()
	}

	private playLocalPlayer() {
		this.soundManager.play()
		// My tracks for Local Player / soundManager invoke played listeners when played for the first time, but not when paused and played again.
		// Thus we need to set it to Playing state here.
		this._playState = PlayState.Playing
	}

	private nextTrack() {
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
			// not updating mute with same value to minimize spamming
			return
		}
		this.soundManager.instance.masterMuted = muted
		this.musicStreamer.muted = muted
	}

	private setupInstanceListeners() {
		this.addInstancePlayedListener(`${this.label} playedListener`, (_soundInstance?: SoundInstance) => {
			this.onPlayed()
		})

		this.addInstanceEndedListener(`${this.label} endedListener`, (trackEnded?: boolean, _serviceDidStop?: boolean) => {
			if (trackEnded) {
				this.NextTrackAndPlayFromStart()
			}
			if (this.myTracks.timeout) {
					clearTimeout(this.myTracks.timeout)
					this.myTracks.timeout = undefined
			}
		})
	}

	private NextTrackAndPlayFromStart() {
		this.nextTrack()
		this.playFromStart()
	}

	private onPlayed() {
		this._playState = PlayState.Playing
		// listener needs to be called here as the seems view does not update when State is right away set from 'Loading' to 'Playing' (when no loading is needed)
		this._playStateChangeListener()

		if (this._selectedTrack.source === StreamSource.RealtimeVisual) {
			this.realtimeVisualService.onWindowResize(this.windowWidth, this.windowHeight)
			this.realtimeVisualService.playFromStart()
		}
	}

	addInstancePlayedListener(name: string, listener: (soundInstance?: SoundInstance) => void) {
		this.myTracks.instancePlayedListeners.set(name, listener)
		this.musicStreamer.instancePlayedListeners.set(name, listener)
		this.youtubeService.instancePlayedListeners.set(name, listener)
	}

	addInstanceEndedListener(name: string, listener: (trackEnded?: boolean, serviceDidStop?: boolean) => void) {
		this.myTracks.instanceEndedListeners.set(name, listener)
		this.musicStreamer.instanceEndedListeners.set(name, listener)
		this.youtubeService.instanceEndedListeners.set(name, listener)
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
