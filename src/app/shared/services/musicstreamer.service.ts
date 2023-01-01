import { Injectable } from "@angular/core";
import { LogType } from "shared/enums/logType";
import { ITrack } from "../data/track";
import { LogService } from "./log.service";

@Injectable({
	providedIn: 'root',
})

/// https://developers.soundcloud.com/docs/api/html5-widget
/// https://www.npmjs.com/package/soundcloud-widget
/// note that there is a newer package that supports typescript that might be considered to be used instead
/// https://www.npmjs.com/package/soundcloud-embed
export class MusicStreamer {

	private widget: any
	private _volume = 100
	private isMuted = false
	private _isInitialized = false

	get isInitialized() {
		return this._isInitialized
	}

	loadedUrl: string = ''

	readonly instancePlayedListeners!: Map<string, () => void>
	readonly instanceEndedListeners!: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>

	constructor(private logService: LogService) {
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
	}

	init() {
		if (this._isInitialized === true) {
			return;
		}
		this._isInitialized = true
		var SoundcloudWidget = require('soundcloud-widget')
		var iframe = 'scWidget' // can also pass in an iframe node()
		this.widget = new SoundcloudWidget(iframe)

		this.widget.on(SoundcloudWidget.events.FINISH, () => {
			this.logService.log(LogType.Info, "soundcloud track finished / ended")
			this.instanceEndedListeners.forEach((listener) => listener(true))
		})
	}

	load(url: string, playWhenLoaded: boolean) {
		this.logService.log(LogType.Info, "musicStreamer load with url", url)

		var options = {
			auto_play: false,
			buying: false,
			liking: false,
			download: false,
			sharing: false,
			show_artwork: false,
			show_comments: false,
			show_playcount: false,
			show_user: false,
			start_track: 0 // for playlists
		}

		this.widget.load(url, options).then( () => {
			this.logService.log(LogType.Info, "musicStreamer load completed with url", url)
			this.loadedUrl = url
			if (playWhenLoaded) {
				this.playViaWidget();
			}
		})
	}

	play() {
		this.logService.log(LogType.Info, "musicStreamer play")
		// let url = track.soundcloudUrl;
		// if (url === this.loadedUrl) {
			this.playViaWidget()
		// }
		// else {
			// this.load(url, true)
		// }
	}

	playFromStart(track: ITrack) {
		this.logService.log(LogType.Info, "musicStreamer playFromStart", track)
		let url = track.soundcloudUrl;
		this.load(url, true)
		this.widget.setVolume(this._volume)
	}

	private playViaWidget() {
		// this.widget.setVolume(this._volume)
		this.widget.play()
		this.instancePlayedListeners.forEach((listener) => listener())
	}

	pause() {
		this.logService.log(LogType.Info, "musicStreamer pause")
		this.widget.pause()
	}

	set volume(volume: number) {
		if (this.isMuted) {
			return
		}
		this._volume = volume
		this.widget.setVolume(this._volume)
	}

	set muted(muted: boolean) {
		this.isMuted = muted
		if (muted) {
			this.widget.setVolume(0)
		} else {
			this.widget.setVolume(this._volume)
		}
	}

}
