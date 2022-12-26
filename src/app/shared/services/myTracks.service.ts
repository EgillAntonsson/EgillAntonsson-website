import { Injectable } from '@angular/core'
import { SoundType } from 'soundcommon/enum/soundType'
import { SoundData } from 'soundcommon/interface/soundData'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { LayeredMusicController } from 'soundcommon/layeredMusicController'
import { Artist, ITrack, LayeredMusicTrack, Track } from '../data/track'
import { StreamSource } from '../enums/streamSource'
import { LogService } from './log.service'
import { SoundManagerService } from './soundManager.service'

interface Played {
	instance: SoundInstance,
	endedPromise: Promise<SoundInstance>
}

@Injectable({
	providedIn: 'root',
})
export class MyTracksService {
	readonly pathRoot = '../../assets/audio'
	readonly pathGame = `${this.pathRoot}/game`
	readonly pathKuai = `${this.pathRoot}/kuai`
	readonly pathBrothers = `${this.pathRoot}/braedraminning`

	private _isInitialized = false
	get isInitialized() {
		return this._isInitialized
	}

	private _byTracks!: Artist[]
	get byTracks() {
		return this._byTracks
	}

	private _flatTracks!: Track[]
	get flatTracks() {
		return this._flatTracks
	}

	private _tracksByRootUrl!: Map<string, ITrack>
	getTrackByRootUrl(rootUrl: string): ITrack | undefined {
		return this._tracksByRootUrl.get(rootUrl)
	}

	private readonly _instancePlayedListeners!: Map<string, (soundInstance: SoundInstance) => void>
	public get instancePlayedListeners(): Map<string, (soundInstance: SoundInstance) => void> {
		return this._instancePlayedListeners
	}
	readonly instanceEndedListeners!: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>
	private _timeout: NodeJS.Timeout | undefined
	public get timeout() {
		return this._timeout
	}
	public set timeout(value: NodeJS.Timeout | undefined) {
		this._timeout = value
	}

	constructor(private soundManager: SoundManagerService, private logService: LogService) {
		this._instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
	}

	init() {
		if (this._isInitialized) {
			return
		}

		this._byTracks = [
			{name: 'Egill Antonsson', tracks: [
				this.votThemeSong(),
				this.harmoniesOfShadeAndLight(),
				this.weWillMeetAgain(),
				this.magmaMerryGoRound(),
				this.justInTime(),
				this.icelandSocksIntro(),
				this.fortidin(),
				this.toddlerTune(),
				this.oddTimesInSpace(),
				this.lecube()
			], about: this.aboutEgillAntonsson},
			{name: 'Kanez Kane', tracks: [
				this.strawberryCityLights()
			], about: this.aboutKanezKane},
			{name: 'KUAI', tracks: [
				this.pirringur(),
				this.apollo(),
				this.andsetinn(),
				this.hamskipti(),
				this.rover(),
				this.andefni(),
				this.agndofa(),
				this.ofurte(),
				this.lesblindaI(),
				this.lesblindaII()
			], about: this.aboutKuai},
			{name: 'TribeOfOranges', tracks: [
				this.introduction(),
				this.routine(),
				this.hhiCommercial()
			], about: this.aboutTribeOfOranges},
			{name: 'Game Music - Layered', tracks: [
				this.godsruleLayered(),
				this.votLayered()
			], about: ''},
			{name: 'Game Music', tracks: [
				this.cakePopParty(),
				this.symbol6(),
				this.softFreakFiesta(),
				this.habitarium(),
				this.tinyPlaces(),
				this.jol2008(),
				this.jol2009(),
				this.whosYourFriend(),
				this.knowYourFriend(),
				this.stackem(),
				this.glowbulleville(),
				this.godsrule(),
				this.vot(),
				this.crisisGame()
			], about: ''},
			{name: 'Bræðraminning', tracks: [
				this.pesi2002(),
				this.mouse2002(),
				this.rubber2002(),
				this.solos2002(),
				this.takeCare2002(),
				this.beLikeYou2002(),
				this.story2002(),
				this.frumlag2002(),
				this.world2002(),
				this.withoutThem2002(),
				this.myDearOldBrothers(),
				this.pesi1974(),
				this.mouse1975(),
				this.rubber1975(),
				this.solos1975(),
				this.takeCare1976(),
				this.beLikeYou1976(),
				this.story1976(),
				this.frumlag1977(),
				this.world1977(),
				this.withoutThem1977(),
			], about: this.aboutBraedraminning}
		]

		this.flattenTracks()

		this._isInitialized = true
	}

	private get aboutEgillAntonsson() {
		return `I started playing the piano around the age of 7. In my teenage years I added guitar (inspired by <a href="https://www.slashonline.com/">Slash</a> and others), electric bass (because all in the band can't be guitarists) and singing. The tracks where I was the main producer (though sometimes collaborating with others) are published under my name.`
	}

	private get pathToDirEgillAntonsson() {
		return Track.dir + 'egillantonsson/'
	}

	private get aboutKanezKane() {
		return `A partnership with my friend Sindri Bergmann Thorarinsson. We have done lots of music through the decades but have only released to the world a small part of it. We decided to changed that so watch this space...`
	}

	private get aboutBraedraminning() {
		return `My parents kept a cassette with the recordings of the songs my older brothers made. To make sure the songs survived that old cassette, I published the album Bræðraminning, which also includes my takes on their songs.`
	}

	private get pathToDirKanez() {
		return Track.dir + 'kanez/'
	}

	private get pathToDirBraedraminning() {
		return Track.dir + 'braedraminning/'
	}

	private get aboutTribeOfOranges() {
		return `A partnership with my friend Sindri Bergmann Thorarinsson.<We coined the name when we needed to which can be shortened to TOO. Me and Sindri have done a lot together and some are under TOO.`
	}

	private get pathToDirTribeOfOranges() {
		return Track.dir + 'too/'
	}

	private get aboutKuai() {
		return ``
	}

	private get braedraminningArtworkPath() {
		return `${this.pathToDirBraedraminning}braedraminning.jpeg`
	}

	private get aboutBraedraminningTake2002() {
		return `My take on this song, recorded and mixed in 2001-2002. Sindri Bergmann Thorarinsson mastered it as far as could be done in 2022.
	`
	}

	private get pathToDirKuai() {
		return Track.dir + 'kuai/'
	}

	private flattenTracks() {
		this._tracksByRootUrl = new Map<string, ITrack>()
		this._flatTracks = []
		let index = 0
		for (let i = 0; i < this._byTracks.length; i++) {
			for (let j = 0; j < this._byTracks[i].tracks.length; j++) {
				const track = this._byTracks[i].tracks[j]
				track.index = index++
				const artist = this._byTracks[i]
				track.artistName = artist.name
				track.artistAbout = artist.about
				this._flatTracks.push(track)

				this._tracksByRootUrl.set(track.rootUrl, track)
			}
		}
	}

	private simpleTrack(nameUrl: string, namePublic: string, soundPath: string, artworkPath: string, soundCloudUrl: string, spotifyUrl: string, buyUrl: string, about: string, youtubeId = '', primarySource = StreamSource.Soundcloud, fallbackSource = StreamSource.Local) {
		const track = new Track(
			namePublic,
			[SoundData.music(nameUrl, soundPath)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			nameUrl,
			artworkPath,
			about,
			soundCloudUrl,
			spotifyUrl,
			buyUrl,
			youtubeId,
			primarySource,
			fallbackSource
		)
		return track
	}

	private strawberryCityLights() {
		const nameUrl = 'strawberry-city-lights'
		const namePublic = 'Strawberry City Lights'
		const soundCloudUrl = ''
		const spotifyUrl = 'https://open.spotify.com/track/0lRUvYevsLK5pBrTYfl3be?si=04526be015af456e'
		const buyUrl = 'https://www.qobuz.com/se-en/album/strawberry-city-lights-kanez-kane/b31j9xshkikja'
		const about = `Strawberry City Lights is the first track release from Kanez Kane. This version here is close to the finalized version (available on Spotify and other services). The artwork is computer generated from using the title as input keywords.`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirKanez}${nameUrl}.mp3`, `${this.pathToDirKanez}${nameUrl}.jpg`, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private pesi2002() {
		const nameUrl = 'pesi-year-2002'
		const namePublic = 'Pési (year 2002)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/pesi-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/6viU3JhxNEKkY2paBuOEaP'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private mouse2002() {
		const nameUrl = 'mouse-year-2002'
		const namePublic = 'Mouse (year 2002)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/mouse-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/1f2eGiZiCMOMZZbKc52IIH'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002 + `<br>
I did my take on the lyrics, thus differing to some extent.
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private rubber2002() {
		const nameUrl = 'rubber-year-2002'
		const namePublic = 'Rubber (year 2002)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/rubber-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/23kZ3ftMMyigpXU49Rq35Q'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private solos2002() {
		const nameUrl = 'solos-year-2002'
		const namePublic = 'Solos (year 2002)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/solos-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5J8kU1mdqcqKZ0Wb3sxrqj'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

		private takeCare2002() {
			const nameUrl = 'take-care-year-2002'
			const namePublic = 'Take Care (year 2002)'
			const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/take-care-year-2002?in=egill-antonsson/sets/braedraminning'
			const spotifyUrl = 'https://open.spotify.com/track/6xiCd9HFh0SaJEngXtgldj'
			const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
			const about = this.aboutBraedraminningTake2002
			return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
		}

		private beLikeYou2002() {
			const nameUrl = 'be-like-you-year-2002'
			const namePublic = 'Be Like You (year 2002)'
			const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/be-like-you-year-2002?in=egill-antonsson/sets/braedraminning'
			const spotifyUrl = 'https://open.spotify.com/track/4zcgAvMsU46YVTKGmS8vJA'
			const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
			const about = this.aboutBraedraminningTake2002
			return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
		}

	private story2002() {
		const nameUrl = 'story-year-2002'
		const namePublic = 'Story (year 2002)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/story-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/0zcnfEWqzmaCfp7hsbcA9Z'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002 + `<br>
I 'upped the drama' in the lyrics by knocking the headmaster OUT, instead of down.<br>
I don't remember if it was intentional or not.
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private frumlag2002() {
		const nameUrl = 'frumlag-year-2002'
		const namePublic = 'Frumlag (year 2002)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/frumlag-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5fFuGjJMqLS0iPMmiZ3SBc'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private world2002() {
		const nameUrl = 'world-year-2002'
		const namePublic = 'World (year 2002)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/world-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5EFT7M2r9kiJqPn2EtXNoz'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002  + `<br>
I think I 'upped the drama' in the lyrics with 'The world is nothing except hate'<br>
as it could be that Egill sung 'The world is nothing I say "Hey"'.<br>
I also added lyrics where missing, etc.<br>
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private withoutThem2002() {
		const nameUrl = 'without-them-year-2002'
		const namePublic = 'Without them (year 2002)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/without-them-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5cfstB4Y5eIFI79e4KBAk8'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002  + `<br>
I kept with the 'no no no' like in the original (probably the lyrics were not ready)<br>
and in fact went all in on 'no no no' and other sounds :)
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private myDearOldBrothers() {
		const nameUrl = 'my-dear-old-brothers'
		const namePublic = 'My Dear Old Brothers'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/my-dear-old-brothers?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/6mnJyUYVPeoEx8oKUBu4Zw'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = `I saw a chord progression with the title 'Lady Lobo' written in a note book that belonged to the brothers.<br>
I thought this might be an original song and thus wanted to bring it to life for the album.<br>
I added details and shaped the song (making some changes)<br>
and wrote the lyrics (changing the title with it).
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private pesi1974() {
		const nameUrl = 'pesi-year-1974'
		const namePublic = 'Pési (year 1974)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/pesi-year-1974?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5wmAzE3Mc0uWjhjxRf95OQ'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = `Jónas wrote this song for Egill to play on the wurlitzer piano.<br>
Recorded with their band playing that was either Lazarus or Fló (not sure which one).<br>
Egill - wurlitzer<br>
Jónas - guitar<br>
(I will list the band mates later when I have my notes)
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private mouse1975() {
		const nameUrl = 'mouse-year-1975'
		const namePublic = 'Mouse (year 1975)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/mouse-year-1975?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/3qtGfywTgrjxBMQcCdN1xo'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Recorded with their band that was either Lazarus or Fló (not sure which one).<br>
Egill - wurlitzer and vocals<br>
Jónas - guitar<br>
(I will list the band mates later when I have my notes)
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private rubber1975() {
		const nameUrl = 'rubber-year-1975'
		const namePublic = 'Rubber (year 1975)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/rubber-year-1975?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/700fVJsCrH4BBpsMW7B60t'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Recorded with their band that was either Lazarus or Fló (not sure which one).<br>
Egill - wurlitzer and vocals<br>
Jónas - guitar<br>
(I will list the band mates later when I have my notes)
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private solos1975() {
		const nameUrl = 'solos-year-1975'
		const namePublic = 'Solos (year 1975)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/solos-year-1975?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/3X7wZlcTxFwkLs7rvEkkWZ'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Recorded with their band that was either Lazarus or Fló (not sure which one).<br>
Egill - organ<br>
Jónas - guitar<br>
(I will list the band mates later when I have my notes)
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

		private takeCare1976() {
			const nameUrl = 'take-care-year-1976'
			const namePublic = 'Take Care (year 1976)'
			const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/take-care-year-1976?in=egill-antonsson/sets/braedraminning'
			const spotifyUrl = 'https://open.spotify.com/track/2V0X8p2Tefcg5MTrnuuplo'
			const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
			const about =  `Egill playing by himself.<br>
I think this is shortly after Jónas is gone but I'm not sure,<br>
thus I'm guessing a bit the year of this recording (and for the others as well).
`
			return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
		}

		private beLikeYou1976() {
			const nameUrl = 'be-like-you-year-1976'
			const namePublic = 'Be Like You (year 1976)'
			const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/be-like-you-year-1976?in=egill-antonsson/sets/braedraminning'
			const spotifyUrl = 'https://open.spotify.com/track/23YxXCBVwziMTdJnIGqLZx'
			const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
			const about =  `Egill playing by himself.<br>
I think this is not long after Jónas is gone but I'm not sure,<br>
thus I'm guessing a bit the year of this recording (and for the others as well).
`
			return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
		}

	private story1976() {
		const nameUrl = 'story-year-1976'
		const namePublic = 'Story (year 1976)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/story-year-1976?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/47Tf6lPTTaibh0LFGi6ULh'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Egill playing by himself.<br>
I think this is not long after Jónas is gone but I'm not sure,<br>
thus I'm guessing a bit the year of this recording (and for the others as well).
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private frumlag1977() {
		const nameUrl = 'frumlag-year-1977'
		const namePublic = 'Frumlag (year 1977)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/frumlag-year-1977?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/1TV6QGFbW0mdtO8GqXCfay'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Egill playing with his band mates from either Lazarus or Fló (not sure which one).<br>
Egill - organ<br>
(I will list the band mates later when I have my notes)
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private world1977() {
		const nameUrl = 'world-year-1977'
		const namePublic = 'World (year 1977)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/world-year-1977?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/6dI0WypRxmbUK7Rw9TaHpT'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Egill playing with his band mates from either Lazarus or Fló (not sure which one).<br>
Egill - vocals (and maybe guitar)<br>
(I will list the band mates later when I have my notes)
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private withoutThem1977() {
		const nameUrl = 'without-them-year-1977'
		const namePublic = 'Without them (year 1977)'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/without-them-year-1977?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/0rcIAwxbRtRhYbKX0bq142'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Egill playing with his band mates from either Lazarus or Fló (not sure which one).<br>
Egill - vocals (and maybe guitar)<br>
(I will list the band mates later when I have my notes)
`
		return this.simpleTrack(nameUrl, namePublic, `${this.pathToDirBraedraminning}${nameUrl}.ogg`, this.braedraminningArtworkPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private votThemeSong() {
		const nameUrl = 'vikings-of-thule-theme-song'
		const namePublic = 'Vikings of Thule Theme Song'
		const filePath =  `${this.pathToDirEgillAntonsson}${nameUrl}`
		const youtubeId = 'EiiR4cwjNwY'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/vikings-of-thule-theme-song'
		const spotifyUrl = 'https://open.spotify.com/track/35LOjco7IykC60Pqq3DjuU?si=7245ec4caae24d82'
		const buyUrl = 'https://www.qobuz.com/album/vikings-of-thule-theme-song-with-jonas-antonsson-julius-jonasson-egill-antonsson/k6jzobz1suzjb'
		const about = `The song for the Vikings of Thule video teaser. VoT was a game made by the company Gogogic. Lyrics by Jonas B. Antonsson, composed by Jonas and me, performed by me and mixed and produced by Julius Jonasson.`
		return this.simpleTrack(nameUrl, namePublic, `${filePath}.ogg`, `${filePath}.jpg`, soundCloudUrl, spotifyUrl, buyUrl, about, youtubeId, StreamSource.Youtube, StreamSource.Soundcloud)
	}

	private harmoniesOfShadeAndLight() {
		const nameUrl = 'harmonies-of-shade-and-light'
		const namePublic = 'Harmonies of Shade and Light'
		const filePath =  `${this.pathToDirEgillAntonsson}${nameUrl}`
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/harmonies-of-shade-and-light'
		const spotifyUrl = 'https://open.spotify.com/track/1xHXUKERh3a6elM9VdPIUW'
		const buyUrl = 'https://www.qobuz.com/album/harmonies-of-shade-and-light-egill-antonsson/y84mz2hhlrtbc'
		const about = `I got the idea of this song when I was with the family in Thailand at the beginning of 2017.<br>
I borrowed a guitar with missing strings and created a harmony pattern and sung a melody over it.<br>
In circa 2019 I recorded the guitars and arranged the percussions from <a href="https://www.thelooploft.com/collections/drum-loops" target="_blank">The Loop Loft</a>.<br>
In the spring of 2021 my friend and music partner Sindri Bergmann Thorarinsson<br>
helped me structure the song and write the lyrics,<br>
and he recorded my vocals in his studio in Reykjavik.<br>
In April 2022 I recorded the rest of the instruments, processed and mixed the song.`
		return this.simpleTrack(nameUrl, namePublic, `${filePath}.ogg`, `${filePath}.jpg`, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private weWillMeetAgain() {
		const nameUrl = 'we-will-meet-again'
		const namePublic = 'We Will Meet Again'
		const filePath = `${this.pathToDirEgillAntonsson}${nameUrl}`
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/we-will-meet-again'
		const spotifyUrl = 'https://open.spotify.com/track/27t1JaFQlOX6hhkVC6d59Z'
		const buyUrl = 'https://www.qobuz.com/album/we-will-meet-again-egill-antonsson/hytrd9qqfadib'
		const about = `In the spring of 2021 my friend and music partner Sindri Bergmann Thorarinsson<br> asked me to collaborate with him to make a pop song.<br>
Although we've played some pop over the years, we have not focused on creating one per se.<br>
So our goal now was to focus on the 'formula of what makes a good (modern) pop song',<br>
and also speed up our workflow to complete the song in couple of days (from start to finish).<br>
We created the song and lyrics together, I sang in the lyrics and Sindri mixed, processed and polished the whole song.<br>
We put the song under artist Egill Antonsson (for convenience) although it's truly a collaboration.`
		return this.simpleTrack(nameUrl, namePublic,  `${filePath}.ogg`, `${filePath}.jpg`, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private magmaMerryGoRound() {
		const nameUrl = 'magma-merrygoround'
		const namePublic = 'Magma merryGoRound'
		const filePath = `${this.pathToDirEgillAntonsson}${nameUrl}`
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/magma-merrygoround'
		const spotifyUrl = 'https://open.spotify.com/track/06bQmD7bI6N1qGDeIVsGYR'
		const buyUrl = 'https://www.qobuz.com/album/magma-merrygoround-egill-antonsson/bqp8z0xr9lqja'
		const about = `Released at the <a href="https://edisonparty.com">Edison demo-party</a> in 2021 under my new handle/pseudonym Vulkanoman.<br>
My original title for the tune was 'Tivoli Chase Cop 27/16' but I renamed<br>
as I got more and more inspired by my recent trip to the then ongoing volcano eruption in <a href="https://en.wikipedia.org/wiki/Fagradalsfjall">Fagradallsfjall in Iceland</a>`
	return this.simpleTrack(nameUrl, namePublic,  `${filePath}.ogg`, `${filePath}.jpg`, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private justInTime() {
		const track = new Track('Just in Time', [{
				url: `${this.pathRoot}/Just_in_Time.ogg`,
				key: 'justInTime',
				soundType: SoundType.Music,
				maxGain: 1,
				loop: false,
				maxNrPlayingAtOnce: 1
			}],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					let nrOfLoops = 2
					do {
						const {instance, endedPromise} = await sound.play()
						this.instancePlayedListeners.forEach((listener) => listener(instance))
						await endedPromise
						this.instanceEndedListeners.forEach((listener) => listener(nrOfLoops === 1))
						nrOfLoops--
					} while (nrOfLoops > 0)
				}
			})
		return track
	}

	private icelandSocksIntro() {
		const nameUrl = 'iceland-socks-intro'
		const namePublic = 'Iceland Socks: Intro'
		const filePath = `${this.pathToDirEgillAntonsson}${nameUrl}`
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/iceland-socks-intro'
		const spotifyUrl = ''
		const buyUrl = ''
		const about = `Sindri Bergman Thorarinsson and me made this for an Icelandic travel industry campaign that the company Gogogic created in 2008. The talented Gogogic employees were the puppeteers and you can watch the Iceland Socks Outtakes on <a href="https://youtu.be/6n3_NF0g2dg" target="_blank">YouTube</a>`
	return this.simpleTrack(nameUrl, namePublic, '', `${filePath}.jpg`, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private fortidin() {
		const track = new Track(
			'Fortíðin',
			[SoundData.music('fortidin', `${this.pathRoot}/Fortidin.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			})
		return track
	}

	private toddlerTune() {
		const track = new Track(
			'Toddler Tune',
			[SoundData.music('toddlerTune', `${this.pathRoot}/Toddler_Tune.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			})
		return track
	}

	private oddTimesInSpace() {
		const track = new Track(
			'Odd Times in Space',
			[SoundData.music('oddTimesInSpace', `${this.pathRoot}/Odd_Times_in_Space.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			})
		return track
	}

	private lecube() {
		const track = new Track(
			'Lecube',
			[SoundData.music('lecube', `${this.pathRoot}/Lecube.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			})
		return track
	}

	private introduction() {
		const nameUrl = 'introduction'
		const namePublic = 'Introduction'
		const filePath = `${this.pathToDirTribeOfOranges}${nameUrl}`
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/introduction'
		const spotifyUrl = ''
		const buyUrl = ''
		const about = `Sindri Bergmann Thorarinsson and me made this for a theatre play,<br>
and it was played at the start of it, and thus it's named Introduction.<br>
For the artwork I chose the 'the indian head', which is a valuable family artifact.`
		return this.simpleTrack(nameUrl, namePublic, '', `${filePath}.jpg`, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private routine() {
		const nameUrl = 'routine'
		const namePublic = 'Routine'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/routine'
		const spotifyUrl = ''
		const buyUrl = ''
		const about = ''
		return this.simpleTrack(nameUrl, namePublic, '', '', soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private hhiCommercial() {
		const nameUrl = 'song-for-hhi-commercial'
		const namePublic = 'Song for HHI commercial'
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/song-for-hhi-commercial'
		const spotifyUrl = ''
		const buyUrl = ''
		const about = ''
		return this.simpleTrack(nameUrl, namePublic, '', '', soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private pirringur() {
		const rootName = 'Pirringur'
		const track = new Track(rootName,
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai,
			this.aboutPirringur
			)
		return track
	}

	private get artworkKuai() {
		return 	`${this.pathToDirKuai}KUAI.jpg`
	}

	private get aboutPirringur() {
		return ``
	}

	private apollo() {
		const rootName = 'Apollo'
		const track = new Track(rootName,
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai
			)
		return track
	}

	private andsetinn() {
		const rootName = 'Andsetinn'
		const track = new Track(rootName,
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai
			)
		return track
	}

	private hamskipti() {
		const rootName = 'Hamskipti'
		const track = new Track(rootName,
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai
			)
		return track
	}

	private rover() {
		const rootName = 'Rover'
		const track = new Track(rootName,
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai
			)
		return track
	}

	private andefni() {
		const rootName = 'Andefni'
		const track = new Track(rootName,
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai
			)
		return track
	}

	private agndofa() {
		const rootName = 'Agndofa'
		const track = new Track(rootName,
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai
			)
		return track
	}

	private ofurte() {
		const rootName = 'Ofurte'
		const track = new Track(rootName,
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai
			)
		return track
	}

	private lesblindaI() {
		const rootName = 'Lesblinda-I'
		const track = new Track(rootName.split('-').join(' '),
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai
			)
		return track
	}

	private lesblindaII() {
		const rootName = 'Lesblinda-II'
		const track = new Track(rootName.split('-').join(' '),
			[SoundData.music(rootName, `${this.pathToDirKuai}${rootName}.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			},
			rootName.toLowerCase(),
			this.artworkKuai
			)
		return track
	}

	private godsruleLayered() {
		const track = new LayeredMusicTrack(
			'Godsrule: Village',
			[
				SoundData.musicLoop('godsruleEnvironmentLayer', `${this.pathGame}/loton_MusicVillageEnvironmentLayer.ogg`, 0.075),
				SoundData.musicLoop('godsruleStringLayer', `${this.pathGame}/loton_MusicVillageStringLayer.ogg`, 0.55),
				SoundData.musicLoop('godsruleHarpLayer', `${this.pathGame}/loton_MusicVillageHarpLayer.ogg`, 0.4),
				SoundData.musicLoop('godsrulePianoLayer', `${this.pathGame}/loton_MusicVillagePianoLayer.ogg`, 0.35)
			],
			() => {
				return async () => {
					const sounds = [
						this.soundManager.instance.getSound(track.soundDatas[0].key),
						this.soundManager.instance.getSound(track.soundDatas[1].key),
						this.soundManager.instance.getSound(track.soundDatas[2].key),
						this.soundManager.instance.getSound(track.soundDatas[3].key)
					]
					const instances: SoundInstance[] = []
					for (let i = 0; i < sounds.length; i++) {
						const sound = sounds[i]
						const {instance} = await sound.play()
						instances.push(instance)
						this.instancePlayedListeners.forEach((listener) => listener(instance))
					}
					track.layeredMusicController.start(instances)
				}
			},
			new LayeredMusicController(this.instanceEndedListeners, this.logService.log))
		return track
	}

	private votLayered() {
		const track = new LayeredMusicTrack(
			'Vikings of Thule: Map',
			[
				SoundData.musicLoop('votWindLayer', `${this.pathGame}/VOT_InterfaceMusic_0.mp3`),
				SoundData.musicLoop('votChoirLayer', `${this.pathGame}/VOT_InterfaceMusic_3.ogg`),
				SoundData.musicLoop('votHarpLayer', `${this.pathGame}/VOT_InterfaceMusic_2.ogg`),
				SoundData.musicLoop('votMelodyLayer', `${this.pathGame}/VOT_InterfaceMusic_1.ogg`)
			],
			() => {
				return async () => {
					const sounds = [
						this.soundManager.instance.getSound(track.soundDatas[0].key),
						this.soundManager.instance.getSound(track.soundDatas[1].key),
						this.soundManager.instance.getSound(track.soundDatas[2].key),
						this.soundManager.instance.getSound(track.soundDatas[3].key)
					]
					const instances: SoundInstance[] = []
					for (let i = 0; i < sounds.length; i++) {
						const sound = sounds[i]
						const {instance} = await sound.play()
						instances.push(instance)
						this.instancePlayedListeners.forEach((listener) => listener(instance))
					}
					track.layeredMusicController.start(instances)
				}
			},
			new LayeredMusicController(this.instanceEndedListeners, this.logService.log))
		return track
	}

	private cakePopParty() {
		const track = new Track(
			'Cake Pop Party',
			[
				SoundData.music('cppMusicIntro', `${this.pathGame}/CPP_workMusicIntroScreen.ogg`, 0.7),
				SoundData.music('cppMusicScaleBeat', `${this.pathGame}/CPP_musicTransitionBeatFade.ogg`, 0.6),
				SoundData.music('cppMusicMakePop', `${this.pathGame}/CPP_workMusicMakePopLoop.ogg`, 0.7),
			],
			() => {
				return async () => {
					const cppIntro = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const scaleBeat = this.soundManager.instance.getSound(track.soundDatas[1].key)
					const makePop = this.soundManager.instance.getSound(track.soundDatas[2].key)

					let played: Played
					let nrOfLoop = 2
					do {
						played = await cppIntro.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await cppIntro.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await scaleBeat.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await makePop.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener(nrOfLoop === 1))

						nrOfLoop--
					} while (nrOfLoop > 0)
				}
			})
		return track
	}

	private symbol6() {
		const track = new Track(
			'Symbol 6',
			[
				SoundData.music('ssixMenu', `${this.pathGame}/SSIX_menu.ogg`),
				SoundData.music('ssixGame', `${this.pathGame}/SSIX_game.ogg`),
				SoundData.music('ssixHexago', `${this.pathGame}/SSIX_HexagoTune.ogg`),
			],
			() => {
				return async () => {
					const menu = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const game = this.soundManager.instance.getSound(track.soundDatas[1].key)
					const hexago = this.soundManager.instance.getSound(track.soundDatas[2].key)

					let played: Played
					let nrOfLoop = 2
					do {
						played = await menu.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await game.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await hexago.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener(nrOfLoop === 1))

					nrOfLoop--
					} while (nrOfLoop > 0)
				}
			})
		return track
	}

	private softFreakFiesta() {
		const track = new Track(
			'Soft Freak Fiesta',
			[
				SoundData.music('sffIntroMenuMusic', `${this.pathGame}/SFF_IntroMenuMusic.ogg`, 0.9),
				SoundData.music('sffMenuMusic', `${this.pathGame}/SFF_MenuMusic.ogg`, 0.9),
				SoundData.music('sffLevelMusicNoEnv', `${this.pathGame}/SFF_LevelMusic_noEnv.ogg`),
				SoundData.music('sffLevelMusicBubbling', `${this.pathGame}/SFF_LevelMusic_bubbling.ogg`),
				SoundData.music('sffLoseJingle', `${this.pathGame}/SFF_LoseJingle.ogg`, 0.9),
				SoundData.music('sffWinJingle', `${this.pathGame}/SFF_WinJingle.ogg`, 0.9)
			],
			() => {
				return async () => {
					const introMenu = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const mainMenu = this.soundManager.instance.getSound(track.soundDatas[1].key)
					const levelNoEnv = this.soundManager.instance.getSound(track.soundDatas[2].key)
					const levelBubbling = this.soundManager.instance.getSound(track.soundDatas[3].key)
					const loseJingle = this.soundManager.instance.getSound(track.soundDatas[4].key)
					const winJingle = this.soundManager.instance.getSound(track.soundDatas[5].key)
					let playLose = true

					let played: Played
					played = await introMenu.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					let nrOfLoop = 2
					do {
						played = await mainMenu.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await levelNoEnv.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await levelBubbling.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						if (playLose) {
							played = await loseJingle.play()
						} else {
							played = await winJingle.play()
						}
						playLose = !playLose
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener(nrOfLoop === 1))

						--nrOfLoop
					} while (nrOfLoop > 0)
				}
			})
		return track
	}

	private habitarium() {
		const track = new Track(
			'Habitarium',
			[
				SoundData.music('habitariumMainTheme', `${this.pathGame}/Habitarium_main_theme.ogg`, 0.9),
				SoundData.music('habitariumInGameLoop', `${this.pathGame}/Habitarium_InGameLoop.ogg`, 0.8)
			],
			() => {
				return async () => {
					const main = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const inGame = this.soundManager.instance.getSound(track.soundDatas[1].key)

					let played: Played
					let nrOfLoop = 2
					do {
						played = await main.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

					played = await inGame.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(nrOfLoop === 1))

					nrOfLoop--
					} while (nrOfLoop > 0)
				}
			})
		return track
	}

	private tinyPlaces() {
		const track = new Track(
			'Tiny Places',
			[
				SoundData.music('tpMainThemeIntro', `${this.pathGame}/TP_mainThemeIntro.ogg`, 0.8),
				SoundData.music('tpMainThemeBridge', `${this.pathGame}/TP_mainThemeBridge.ogg`, 0.8),
				SoundData.music('tpSpaceWorld', `${this.pathGame}/TP_spaceWorld.ogg`, 0.8),
				SoundData.music('tpTomb', `${this.pathGame}/TP_tomb.ogg`, 0.8),
				SoundData.music('tpLazyStyle', `${this.pathGame}/TP_lazyStyle.ogg`, 0.8),
				SoundData.music('tpCutScene', `${this.pathGame}/TP_cutScene.ogg`, 0.8),
				SoundData.music('tpInGame', `${this.pathGame}/TP_inGame.ogg`, 0.8),
				SoundData.music('tpOutOfTime', `${this.pathGame}/TP_outoftime.ogg`, 0.8),
			],
			() => {
				return async () => {
					const intro = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const bridge = this.soundManager.instance.getSound(track.soundDatas[1].key)
					const space = this.soundManager.instance.getSound(track.soundDatas[2].key)
					const tomb = this.soundManager.instance.getSound(track.soundDatas[3].key)
					const lazy = this.soundManager.instance.getSound(track.soundDatas[4].key)
					const cut = this.soundManager.instance.getSound(track.soundDatas[5].key)
					const inGame = this.soundManager.instance.getSound(track.soundDatas[6].key)
					const time = this.soundManager.instance.getSound(track.soundDatas[7].key)

					let played: Played
					played = await intro.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))

					const curTime = intro.audioCtx.currentTime
					played.instance.gainWrapper.setValueAtTime(0.4, curTime).exponentialRampToValueAtTime(0.8, curTime + 0.3)

					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await bridge.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await space.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await space.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await tomb.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await tomb.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await lazy.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await lazy.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await cut.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await inGame.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await time.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			})
		return track
	}

	private jol2008() {
		const track = new Track(
			'Christmas Game 2008',
			[
				SoundData.music('jol2008mainMusic', `${this.pathGame}/jolagogo2008_main_music.ogg`),
				SoundData.music('jol2008gameOver', `${this.pathGame}/jolagogo2008_game_over.ogg`)
			],
			() => {
				return async () => {
					const main = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const gameOver = this.soundManager.instance.getSound(track.soundDatas[1].key)

					let played: Played
					played = await main.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await main.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await gameOver.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			})
		return track
	}

	private jol2009() {
		const track = new Track(
			'Christmas Game 2009',
			[
				SoundData.music('jol2009bridge', `${this.pathGame}/jolagogo2009_Bridge.ogg`),
				SoundData.music('jol2009chorus', `${this.pathGame}/jolagogo2009_Chorus.ogg`),
			],
			() => {
				return async () => {
					const bridge = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const chorus = this.soundManager.instance.getSound(track.soundDatas[1].key)

					let played: Played
					let nrOfLoops = 2
					do {
						played = await bridge.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))

						if (nrOfLoops === 2) {
							const curTime = bridge.audioCtx.currentTime
							played.instance.gainWrapper.setValueAtTime(0.1, curTime).exponentialRampToValueAtTime(1, curTime + 0.25)
						}

						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await chorus.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener(nrOfLoops === 1))

						nrOfLoops--
					} while (nrOfLoops > 0)
				}
			})
		return track
	}

	private whosYourFriend() {
		const track = new Track('Who\'s Your Friend',
			[SoundData.music('wyf',  `${this.pathGame}/WYF_ThemeSong.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			})
		return track
	}

	private knowYourFriend() {
		const track = new Track(
			'Know Your Friend',
			[
				SoundData.music('kyfIntroMusic', `${this.pathGame}/KYF_IntroMusic_WithAudience.ogg`),
				SoundData.music('kyf90secMusic', `${this.pathGame}/KYF_90secondsMusic.ogg`)
			],
			() => {
				return async () => {
					const intro = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const seconds = this.soundManager.instance.getSound(track.soundDatas[1].key)

					let played: Played
					played = await seconds.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await intro.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await intro.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await seconds.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			})
		return track
	}

	private stackem() {
		const track = new Track(
			'Stack\'em',
			[SoundData.music('stackem', `${this.pathGame}/Stackem_Tune_loop.ogg`, 0.9)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)

					let nrOfLoops = 2
					do {
						const {instance, endedPromise} = await sound.play()
						this.instancePlayedListeners.forEach((listener) => listener(instance))
						await endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())
						nrOfLoops--
					} while (nrOfLoops > 0)
				}
			})
		return track
	}

	private glowbulleville() {
		const track = new Track(
			'Glowbulleville',
			[
				SoundData.music('glowMainMusic', `${this.pathGame}/GLOB_main_music.mp3`, 0.8),
				SoundData.music('glowVillageMusic', `${this.pathGame}/GLOB_village_music.mp3`),
				SoundData.music('glowWack', `${this.pathGame}/GLOB_wack_a_mole.mp3`, 0.8)
			],
			() => {
				return async () => {
					const main = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const village = this.soundManager.instance.getSound(track.soundDatas[1].key)
					const wack = this.soundManager.instance.getSound(track.soundDatas[2].key)

					let played: Played
					let nrOfLoops = 2
					do {
						played = await main.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await main.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await village.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await village.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await wack.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener(nrOfLoops === 1))

						nrOfLoops--
					} while (nrOfLoops > 0)
				}
			})
		return track
	}

	private godsrule() {
		const track = new Track(
			'Godsrule: Battle',
			[
				SoundData.music('godsruleBattle', `${this.pathGame}/LOTON_BattleBaseLayer.ogg`),
				SoundData.music('godsruleDefeat', `${this.pathGame}/LOTON_CombatDefeatMusic.ogg`),
				SoundData.music('godsruleVictory', `${this.pathGame}/LOTON_CombatVictory.ogg`),
			],
			() => {
				return async () => {
					const battle = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const defeat = this.soundManager.instance.getSound(track.soundDatas[1].key)
					const victory = this.soundManager.instance.getSound(track.soundDatas[2].key)

					let playReturn: Played
					let nrOfLoops = 2
					do {
						playReturn = await battle.play()
						this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
						await playReturn.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						playReturn = await defeat.play()
						this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
						await playReturn.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						playReturn = await victory.play()
						this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
						await playReturn.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener())

						nrOfLoops--
					} while (nrOfLoops > 0)

					playReturn = await battle.play()
					this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))

					const curTime = battle.audioCtx.currentTime
					const duration = playReturn.instance.sourceNode.buffer?.duration || 10
						playReturn.instance.gainWrapper.setTargetAtTime(0, curTime + (duration / 2), (duration / 6))

					await playReturn.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			})
		return track
	}

	private vot() {
		const track = new Track(
			'Vikings of Thule: Feud',
			[
				SoundData.music('votFeudDrums', `${this.pathGame}/VOT_FeudMusic_drums.ogg`),
				SoundData.music('votFeud', `${this.pathGame}/VOT_FeudMusic.ogg`),
				SoundData.music('votFeudEnding', `${this.pathGame}/VOT_FeudEnding.ogg`),
			],
			() => {
				return async () => {
					const feudDrums = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const feud = this.soundManager.instance.getSound(track.soundDatas[1].key)
					const feudEnding = this.soundManager.instance.getSound(track.soundDatas[2].key)

					let played: Played
					played = await feudDrums.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await feud.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await feud.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))

					const curTime = feud.audioCtx.currentTime
					const duration = played.instance.sourceNode.buffer?.duration || 10
					played.instance.gainWrapper.setTargetAtTime(0, curTime + duration - 0.799, 1)

					const asyncTimeout = async () => {
						this.instanceEndedListeners.forEach((listener) => listener())

						played = await feudEnding.play()
						this.instancePlayedListeners.forEach((listener) => listener(played.instance))
						await played.endedPromise
						this.instanceEndedListeners.forEach((listener) => listener(true))
					}

					this.timeout = setTimeout(() => {
						asyncTimeout()
					}, ((played.instance.sourceNode.buffer?.duration || 10) * 1000) - 799)
				}
			})
		return track
	}

	private crisisGame() {
		const track = new Track(
			'The Crisis Game',
			[
				SoundData.music('crisisBegin', `${this.pathGame}/Krepp_Byrjun.ogg`, 0.9),
				SoundData.music('crisisEnd', `${this.pathGame}/Krepp_Endir.ogg`, 0.9),
			],
			() => {
				return async () => {
					const begin = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const end = this.soundManager.instance.getSound(track.soundDatas[1].key)

					let played: Played
					played = await begin.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await begin.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())

					played = await end.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener())
				}
			})
		return track
	}

}
