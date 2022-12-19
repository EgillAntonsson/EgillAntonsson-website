import { Injectable } from "@angular/core";
import { LogType } from "shared/enums/logType";
import { LogService } from "./log.service";

@Injectable({
	providedIn: 'root',
})

export class MusicStreamer {

	private widget: any
	private _volume = 100
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
				this.widget.setVolume(this._volume)
				this.widget.play()
				this.instancePlayedListeners.forEach((listener) => listener())
			}
		})
	}

	play(url: string) {
		this.logService.log(LogType.Info, "musicStreamer play with url", url)
		if (url === this.loadedUrl) {
			this.widget.play()
		}
		else {
			this.load(url, true)
		}
	}

	pause() {
		this.widget.pause()
	}

	set volume(value: number) {
		this._volume = value * 100
		this.widget.setVolume(this._volume)
	}

}
