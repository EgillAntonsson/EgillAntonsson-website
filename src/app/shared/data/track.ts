import { SoundData } from '../../../soundcommon/interface/soundData'
import { LayeredMusicController } from '../../../soundcommon/layeredMusicController'
import { StreamSource } from '../enums/streamSource'

export abstract class Track {
	readonly name: string
	readonly artworkPath: string
	readonly about: string
	readonly rootUrl: string
	readonly soundcloudUrl: string
	readonly spotifyUrl: string
	readonly buyUrl: string
	readonly source!: StreamSource
	readonly fallbackSource!: StreamSource
	index!: number
	artistName!: string
	artistAbout!: string


	public static readonly dir = '../../assets/tracks'
	public static readonly defaultArtworkPath = `${Track.dir}/Egill_Antonsson.png`

	constructor(source: StreamSource, rootUrl: string, name: string, artworkPath: string, about: string, soundcloudUrl: string, spotifyUrl: string, buyUrl: string) {
		this.source = source
		this.name = name
		this.artworkPath = artworkPath
		if (artworkPath === '') {
			this.artworkPath = Track.defaultArtworkPath
		}
		this.about = about
		this.rootUrl = rootUrl
		this.soundcloudUrl = soundcloudUrl
		this.spotifyUrl = spotifyUrl
		this.buyUrl = buyUrl
	}
}

export class LocalTrack extends Track {

	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>
	constructor(soundDatas: SoundData[], play: () => () => Promise<void>, rootUrl: string, name: string, artworkPath: string = '', about: string = '', soundcloudUrl: string = '', spotifyUrl: string = '', buyUrl: string = '') {
		super(StreamSource.Local, rootUrl, name, artworkPath, about, soundcloudUrl, spotifyUrl, buyUrl)
		this.soundDatas = soundDatas
		this.play = play
	}
}
export class RealtimeVisualTrack extends Track {
	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>
	isGraphicsActive: boolean

	constructor(soundDatas: SoundData[], play: () => () => Promise<void>, rootUrl: string, name: string, artworkPath: string = '', about: string = '', soundcloudUrl: string = '', spotifyUrl: string = '', buyUrl: string = '') {
		super(StreamSource.RealtimeVisual, rootUrl, name, artworkPath, about, soundcloudUrl, spotifyUrl, buyUrl)
		this.soundDatas = soundDatas
		this.play = play
		this.isGraphicsActive = true
	}
}

export class YoutubeTrack extends Track {
	readonly youtubeId: string
	readonly displayOnYoutube: boolean
	isGraphicsActive: boolean
	constructor(youtubeId: string, displayOnYoutube: boolean, rootUrl: string = '', name: string, artworkPath: string = '', about: string = '', soundcloudUrl: string = '', spotifyUrl: string = '', buyUrl: string = '') {
		super(StreamSource.Youtube, rootUrl, name, artworkPath, about, soundcloudUrl, spotifyUrl, buyUrl)
		this.youtubeId = youtubeId
		this.displayOnYoutube = displayOnYoutube
		this.isGraphicsActive = displayOnYoutube
	}
}

export class SoundcloudTrack extends Track {
	constructor(soundcloudUrl: string, rootUrl: string, name: string, artworkPath: string = '', about: string = '', spotifyUrl: string = '', buyUrl: string = '') {
		super(StreamSource.Soundcloud, rootUrl, name, artworkPath, about, soundcloudUrl, spotifyUrl, buyUrl)
	}
}


export class LayeredMusicTrack extends LocalTrack {
	readonly layeredMusicController: LayeredMusicController
	constructor(layeredMusicController: LayeredMusicController, soundDatas: SoundData[], play: () => () => Promise<void>, rootUrl: string, name: string, artworkPath: string = '', about: string = '') {
		super(soundDatas, play, rootUrl, name, artworkPath, about)
		this.layeredMusicController = layeredMusicController
	}
}

export interface Artist {
	name: string
	tracks: Track[]
	about: string
}
