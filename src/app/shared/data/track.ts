import { SoundData } from '../../../soundcommon/interface/soundData'
import { LayeredMusicController } from '../../../soundcommon/layeredMusicController'

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
	index!: number
	artistName!: string
	artistAbout!: string


	static readonly folder = '../../assets/tracks/'
	private readonly defaultArtworkFilename = 'Egill_Antonsson.png'

	//// old members
	// purchaseUrl?: string

	constructor(name: string
		, soundDatas: SoundData[]
		, play: () => () => Promise<void>
		, artworkPath: string = ''
		, about: string = ''
		, rootUrl: string = 'not-defined'
		, soundcloudUrl: string = ''
		, spotifyUrl: string = ''
		, buyUrl: string = '') {

		this.name = name
		this.soundDatas = soundDatas
		this.play = play
		this.artworkPath = artworkPath
		if (artworkPath === '') {
			this.artworkPath = Track.folder + this.defaultArtworkFilename
		}
		this.about = about
		this.rootUrl = rootUrl
		this.soundcloudUrl = soundcloudUrl
		this.spotifyUrl = spotifyUrl
		this.buyUrl = buyUrl
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
