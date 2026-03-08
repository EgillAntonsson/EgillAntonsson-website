import { SoundData } from '../../../soundcommon/interface/soundData'
import { LayeredMusicController } from '../../../soundcommon/layeredMusicController'
import { StreamSource } from '../enums/streamSource'

export abstract class Track {
	readonly name: string
	readonly artworkPath: string
	readonly about: string
	readonly lyrics: string
	readonly rootUrl: string
	readonly soundcloudUrl: string
	readonly spotifyUrl: string
	readonly qobuzUrl: string
	readonly bandcampUrl: string
	readonly bpm: number
	readonly beatsInBar: number
	readonly source!: StreamSource
	readonly fallbackSource!: StreamSource
	index!: number
	artistName!: string
	artistAbout!: string


	public static readonly dir = '../../assets/tracks'
	public static readonly defaultArtworkPath = `${Track.dir}/Egill_Antonsson.png`

	constructor(source: StreamSource, rootUrl: string, name: string, artworkPath: string, about: string, soundcloudUrl: string, spotifyUrl: string, qobuzUrl: string, bandcampUrl: string, lyrics: string, bpm: number, beatsInBar: number) {
		this.source = source
		this.name = name
		this.artworkPath = artworkPath
		if (artworkPath === '') {
			this.artworkPath = Track.defaultArtworkPath
		}
		this.about = about
		this.lyrics = lyrics
		this.rootUrl = rootUrl
		this.soundcloudUrl = soundcloudUrl
		this.spotifyUrl = spotifyUrl
		this.qobuzUrl = qobuzUrl
		this.bandcampUrl = bandcampUrl
		this.bpm = bpm
		this.beatsInBar = beatsInBar
	}
}

export class LocalTrack extends Track {
	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>
	constructor(soundDatas: SoundData[], play: () => () => Promise<void>, rootUrl: string, name: string, artworkPath: string = '', about: string = '', lyrics: string = '', soundcloudUrl: string = '', spotifyUrl: string = '', qobuzUrl: string = '', bandcampUrl: string = '', bpm: number = 120, beatsInBar: number = 4) {
		super(StreamSource.Local, rootUrl, name, artworkPath, about, lyrics, soundcloudUrl, spotifyUrl, qobuzUrl, bandcampUrl, bpm, beatsInBar)
		this.soundDatas = soundDatas
		this.play = play
	}
}

export class RealtimeVisualTrack extends Track {
	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>
	isGraphicsActive: boolean

	constructor(soundDatas: SoundData[], play: () => () => Promise<void>, rootUrl: string, name: string, artworkPath: string = '', about: string = '', soundcloudUrl: string = '', spotifyUrl: string = '', qobuzUrl: string = '', bandcampUrl: string = '', lyrics: string = '', bpm: number = 120, beatsInBar: number = 4) {
		super(StreamSource.RealtimeVisual, rootUrl, name, artworkPath, about, soundcloudUrl, spotifyUrl, qobuzUrl, bandcampUrl, lyrics, bpm, beatsInBar)
		this.soundDatas = soundDatas
		this.play = play
		this.isGraphicsActive = true
	}
}

export class YoutubeTrack extends Track {
	readonly youtubeId: string
	readonly displayOnYoutube: boolean
	isGraphicsActive: boolean
	constructor(youtubeId: string, displayOnYoutube: boolean, rootUrl: string = '', name: string, artworkPath: string = '', about: string = '', soundcloudUrl: string = '', spotifyUrl: string = '', qobuzUrl: string = '', bandcampUrl: string = '', lyrics: string = '', bpm: number = 120, beatsInBar: number = 4) {
		super(StreamSource.Youtube, rootUrl, name, artworkPath, about, soundcloudUrl, spotifyUrl, qobuzUrl, bandcampUrl, lyrics, bpm, beatsInBar)
		this.youtubeId = youtubeId
		this.displayOnYoutube = displayOnYoutube
		this.isGraphicsActive = displayOnYoutube
	}
}

export class SoundcloudTrack extends Track {
	constructor(soundcloudUrl: string, rootUrl: string, name: string, artworkPath: string = '', about: string = '', spotifyUrl: string = '', qobuzUrl: string = '', bandcampUrl: string = '', lyrics: string = '', bpm: number = 120, beatsInBar: number = 4) {
		super(StreamSource.Soundcloud, rootUrl, name, artworkPath, about, soundcloudUrl, spotifyUrl, qobuzUrl, bandcampUrl, lyrics, bpm, beatsInBar)
	}
}

export class LayeredMusicTrack extends LocalTrack {
	readonly layeredMusicController: LayeredMusicController
	constructor(layeredMusicController: LayeredMusicController, soundDatas: SoundData[], play: () => () => Promise<void>, rootUrl: string, name: string, artworkPath: string = '', about: string = '', lyrics: string = '', bpm: number = 120, beatsInBar: number = 4) {
		super(soundDatas, play, rootUrl, name, artworkPath, about, lyrics, '', '', '', '', bpm, beatsInBar)
		this.layeredMusicController = layeredMusicController
	}
}

export interface Artist {
	name: string
	tracks: Track[]
	about: string
}
