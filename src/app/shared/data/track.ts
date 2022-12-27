import { SoundData } from '../../../soundcommon/interface/soundData'
import { LayeredMusicController } from '../../../soundcommon/layeredMusicController'
import { StreamSource } from '../enums/streamSource'

export interface ITrack {
	readonly name: string
	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>
	readonly artworkPath: string
	readonly about: string
	readonly rootUrl: string
	readonly soundcloudUrl: string
	readonly spotifyUrl: string
	readonly buyUrl: string
	index: number
	artistName: string
	artistAbout: string
	youtubeId: string,
	source: StreamSource
	fallbackSource: StreamSource
}

export class Track implements ITrack {
	readonly name: string
	readonly soundDatas: SoundData[]
	readonly play: () => () => Promise<void>
	readonly artworkPath: string
	readonly about: string
	readonly rootUrl: string
	readonly soundcloudUrl: string
	readonly spotifyUrl: string
	readonly buyUrl: string
	readonly youtubeId: string
	readonly source!: StreamSource
	readonly fallbackSource!: StreamSource
	index!: number
	artistName!: string
	artistAbout!: string


	static readonly dir = '../../assets/tracks/'
	private readonly defaultArtworkFilename = 'Egill_Antonsson.png'

	constructor(name: string, soundDatas: SoundData[], play: () => () => Promise<void>, rootUrl: string = '', artworkPath: string = '', about: string = '', soundcloudUrl: string = '', spotifyUrl: string = '', buyUrl: string = '', youtubeId: string = '', source: StreamSource = StreamSource.Soundcloud, secondarySource: StreamSource = StreamSource.Local) {

		this.name = name
		this.soundDatas = soundDatas
		this.play = play
		this.artworkPath = artworkPath
		if (artworkPath === '') {
			this.artworkPath = Track.dir + this.defaultArtworkFilename
		}
		this.about = about
		this.rootUrl = rootUrl
		this.soundcloudUrl = soundcloudUrl
		this.spotifyUrl = spotifyUrl
		this.buyUrl = buyUrl
		this.youtubeId = youtubeId
		this.source = source
		this.fallbackSource = secondarySource
	}
}

export class LayeredMusicTrack extends Track {

	readonly layeredMusicController: LayeredMusicController
	constructor(name: string, soundDatas: SoundData[], play: () => () => Promise<void>, layeredMusicController: LayeredMusicController) {
		super(name, soundDatas, play)
		this.layeredMusicController = layeredMusicController
	}
}

export interface Artist {
	name: string
	tracks: Track[]
	about: string
}
