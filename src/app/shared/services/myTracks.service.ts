import { Injectable } from '@angular/core'
import { SoundData } from 'soundcommon/interface/soundData'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { LayeredMusicController } from 'soundcommon/layeredMusicController'
import { Artist, Track, LayeredMusicTrack, YoutubeTrack, SoundcloudTrack, LocalTrack, RealtimeVisualTrack } from '../data/track'
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

	private _tracksByRootUrl!: Map<string, Track>
	getTrackByRootUrl(rootUrl: string): Track | undefined {
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

//#region Dirs And Paths
	private readonly dirEgillAntonsson = `${Track.dir}/egillantonsson/`
	private readonly dirKanez = `${Track.dir}/kanez/`
	private readonly dirTribeOfOranges = `${Track.dir}/too/`
	private readonly dirGameMusicLayered = `${Track.dir}/game/music-layered/`
	private readonly dirGameMusic = `${Track.dir}/game/music`
	private readonly dirBraedraminning = `${Track.dir}/braedraminning/`
	private readonly pathBraedraminningArtwork = `${this.dirBraedraminning}braedraminning.jpeg`
	private readonly dirKuai = `${Track.dir}/kuai/`
	private readonly pathKuaiArtwork = `${this.dirKuai}KUAI.jpg`
//#endregion

	//#region URLS
	private urlSindri(fullName = false) {
		let name = 'Sindri'
		if (fullName) {
			name = 'Sindri Bergmann Þórarinsson'
		}
		return `<a href="https://www.f6s.com/member/sindribergmannrarinsson#about" target="_blank">${name}</a>`
	}

	private urlSteini(fullName = false) {
		let name = 'Steini' // nickname
		if (fullName) {
			name = 'Guðmundur Steinn Gunnarsson'

		}
		return `<a href="https://gudmundursteinn.net" target="_blank">${name}</a>`
	}

	private urlSiggi(fullName = false) {
		let name = 'Siggi' // nickname
		if (fullName) {
			name = 'Sigurður Þór Rögnvaldsson'

		}
		return `<a href="https://www.last.fm/music/Sigurdur+R%C3%B6gnvaldsson" target="_blank">${name}</a>`
	}

	private urlDori(fullName = false) {
		let name = 'Dóri' // nickname
		if (fullName) {
			name = 'Halldór Andri Bjarnason'
		}
		return `<a href="http://www.77.is" target="_blank">${name}</a>`
	}

	private urlGogogic = `<a href=https://www.facebook.com/gogogic target="_blank">Gogogic</a>`
//#endregion

	private get aboutEgillAntonsson() {
		return `I began my musical journey at age 7 with the piano. In my early teens, I was drawn to the guitar, inspired by icons like <a href="https://www.slashonline.com/"  target="_blank">Slash</a>. Alongside my two friends, all of us guitarists, we formed a band and I embraced the electric bass, recognizing its significance (alongside the drums) in modern music genres. Growing up in choirs my mother Halla Soffía Jónasdóttir sung in, I started myself singing more and more.<br>
		In my late teens, my passion for the piano resurfaced, leading me to focus on jazz piano, and a bit of bass, at FÍH music school. There, I had the privilege of learning from exceptional mentors, including <a href="https://www.agnarmagnusson.com" target="_blank">Agnar Már Magnússon</a>, <a href="https://open.spotify.com/artist/1mtaJAxoe50UVhxjG3BRDd?si=da5LV9aAT6mNstXEwgnoeA" target="_blank">Eyþór Gunnarsson</a>, <a href="https://open.spotify.com/artist/07AnAQ7ktaTxhqaAJvSCRG?si=vJpKq05ORHyxWWrFSVpSrA" target="_blank">Jóhann Ásmundsson</a>, and <a href="https://www.sigurdurflosason.com" target="_blank">Sigurður Flosason</a>.<br>
		Around the turn of this century, I was in the band <a href="https://egill.rocks/music/pirringur" target="_blank">KUAI</a> which shone brightly before fading out. Throughout my journey, I collaborated with many talented musicians, yet my most enduring partnership remains with ${this.urlSindri()}. Currently we produce music as <a href="https://egill.rocks/music/tonis-time-machine" target="_blank">Kanez Kane</a>.<br>
		<br>You can find more details about these collaborations in the 'About' section of the corresponding tracks.`
	}

	private get aboutKanez() {
		return `A partnership with my friend <a href="https://www.f6s.com/member/sindribergmannrarinsson#about">Sindri Bergmann Thorarinsson</a>. While we have created a vast amount of music together, we have only released a small portion of it to the world. However, we are excited to announce that we will be releasing more of our music soon, so stay tuned for updates.`
	}

	private get aboutBraedraminning() {
		return `My parents kept a cassette with the recordings of the songs my older brothers made. To make sure the songs survived that old cassette, I published the album Bræðraminning, which also includes my takes on their songs.`
	}

	private get aboutTribeOfOranges() {
		return `A partnership with my friend <a href="https://www.f6s.com/member/sindribergmannrarinsson#about">Sindri Bergmann Thorarinsson</a>. Some of our music is under Tribe Of Oranges.`
	}

	private get aboutKuai() {
		return `The instrumental post-rock band KUAI was formed in Reykjavik, Iceland, in the summer of 1998. The band consisted of Baldur Ingvar Sigurðsson on drums, Egill Antonsson on bass, and ${this.urlSteini(true)} (called Steini) and ${this.urlSiggi(true)} (called Siggi) on guitars. When asked to describe their music, the band explained that it is difficult to put into words, but it can be categorized as instrumental rock with experimental elements. They draw inspiration from their roots in rock and heavy metal, and the guitars often improvise lines influenced by jazz improvisation, while the bass and drums provide powerful patterns as the foundation.<br><br>
		The album "kuai" was recorded between September 2000 and June 2001 by <a href="https://open.spotify.com/artist/1bh1wQxtLdKOi9gCAEglwl" target="_blank">Elmar Þór Gilbertsson</a>, then the band mixed the album themselves. One track, "Rover," was recorded and mixed by Jón Elvar Hafsteinsson in 1999. The album cover was designed by ${this.urlDori()}. From October 2001, the band assembled the CDs and sent to Hljómalind music store and sold at concerts.<br>
		To capture the raw energy and spontaneity of their performances, the band opted for a "live" studio recording (without an audience). However, some parts were recorded separately afterwards, including some guitar parts, organ and piano played by Egill, saxophone in "Andefni" played by Steinar Sigurðsson, and cellos in "Lesblinda I" and "Lesblinda II" played by Hallgrímur Jónas Jensson and Rannveig Bjarnadóttir ( ${this.urlSteini()} arranged the cello parts).<br>
		Due to an accidental finger cut on his "fretting" hand at the beginning of the recording period,  ${this.urlSteini()} re-tuned his guitar, and the band transposed many tracks to D in order to minimize strain on his injured hand while playing. Egill also re-tuned his deepest string to D on his 4 string bass in many of the tracks.<br>`
	}

	private get aboutBraedraminningTake2002() {
		return `My take on this song, recorded and mixed in 2001-2002. ${this.urlSindri(true)} mastered in 2022 (as well as could be done).`
	}

	private readonly aboutGameMusicLayered = `When Head of Sound at the company ${this.urlGogogic} from 2008 to 2013 I developed a method called "Layered Music" to balance rich musical experiences with minimal resource usage and monotony. This technique fades in and fades out music layers based on user activity.`

	private readonly aboutGameMusic = `When I was Head of Sound at the company ${this.urlGogogic} from 2008 to 2013  I composed, designed and produced the Music and SFX for the games.`


	constructor(private soundManager: SoundManagerService, private logService: LogService) {
		this._instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
		// for instanceEndedListeners send in 'true' to indicate that the track ended
	}

	init() {
		if (this._isInitialized) {
			return
		}

		this._byTracks = [
			{name: 'Egill Antonsson', tracks: [
				this.leCube(),
				this.votThemeSong(),
				this.harmoniesOfShadeAndLight(),
				this.weWillMeetAgain(),
				this.magmaMerryGoRound(),
				this.justInTime(),
				this.icelandSocksIntro(),
				this.fortidin(),
				this.toddlerTune(),
				this.oddTimesInSpace()
			], about: this.aboutEgillAntonsson},
			{name: 'Kanez Kane', tracks: [
				this.tonisTimeMachine(),
				this.winterQueen(),
				this.komaKoma(),
				this.strawberryCityLights()
			], about: this.aboutKanez},
			{name: 'KUAI', tracks: [
				this.andefniLive(),
				this.pirringurLive(),
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
			{name: 'Tribe Of Oranges', tracks: [
				this.introduction(),
				this.routine(),
				this.hhiCommercial()
			], about: this.aboutTribeOfOranges},
			{name: 'Game Music - Layered', tracks: [
				this.godsruleLayered(),
				this.votLayered()
			], about: this.aboutGameMusicLayered},
			{name: 'Game Music', tracks: [
				this.godsrule(),
				this.vot(),
				this.tinyPlaces(),
				this.cakePopParty(),
				this.softFreakFiesta(),
				this.symbol6(),
				this.habitarium(),
				this.jol2008(),
				this.jol2009(),
				this.whosYourFriend(),
				this.knowYourFriend(),
				this.stackem(),
				this.glowbulleville(),
				this.crisisGame()
			], about: this.aboutGameMusic},
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

	private flattenTracks() {
			this._tracksByRootUrl = new Map<string, Track>()
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

	private leCube() {
		const rootUrl = 'le-cube'
		const name = 'Le Cube ◇ Mass Psychosis'
		const artworkPath = `${this.dirEgillAntonsson}${rootUrl}.jpg`
		const about = `A demoscene entry collaboration with my friend Erik Byström (klovman) in 2014. He created and programmed the visuals and I (Vulkanoman) created the music. In 2023 I enhanced the music a la Mass Psychosis.`

		const track = new RealtimeVisualTrack([SoundData.music(rootUrl, `${this.dirEgillAntonsson}/${rootUrl}.ogg`)],
		() => {
			return async () => {
				const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)

				const {instance, endedPromise} = await sound.play()
				this.instancePlayedListeners.forEach((listener) => listener(instance))
				await endedPromise
				this.instanceEndedListeners.forEach((listener) => listener(true))
			}
		}, rootUrl, name, artworkPath, about)
		return track
	}

	private winterQueen() {
		const rootUrl = 'winter-queen'
		const name = 'Winter Queen'
		const artworkPath = `${this.dirKanez}${rootUrl}.jpg`
		const spotifyUrl = 'https://open.spotify.com/track/56X0rSJh8MRO2aJTZfSgpF?si=ec263723abbf4f29'
		const buyUrl = 'https://www.qobuz.com/album/winter-queen-kanez-kane/i0evkfp38ctac'
		const about = `The third song release by Kanez Kane, 7th February 2023. Composed during the 1st Stockholm music session (<a href="https://www.f6s.com/member/sindribergmannrarinsson#about">Sindri</a> visited me). Fittingly the weather both in Sweden and Iceland was cold throughout the whole production period.<br>
		<br>LYRICS<br>
		Verse 1:<br>
		Josefine, the frostbites and scars.<br>
		Josefine, you're cold from afar.<br>
		Every night I pray for... Every night I scream...<br>
		I'm afraid I'll end up like my queen.<br>
		Verse 2:<br>
		Josefine, the north wind is harsh.<br>
		Josefine, my shivering dreams.<br>
		Every day I beg you... Every day I try...<br>
		Nothing but the icing on your heart.<br>
		Pre-chorus:<br>
		Oh, the long, cold winter nights.<br>
		Cold breath, nothing seems right.<br>
		Chorus:<br>
		Josefine, winter queen.<br>
		Josefine, don't be so mean, my winter queen.<br>
		Verse 3:<br>
		Josefine, a cold summer day.<br>
		Josefine, I'm melting away.<br>
		Every time I feel you... Every time I cry...<br>
		Your frosty tongue is waiting in the dark.<br>
		-> Pre-chorus -> Chorus<br>
		Weather forecast: It seems like there's a storm, coming...<br>`

		return new YoutubeTrack('gNL39MCw8Jw', false,  rootUrl, name, artworkPath, about, '', spotifyUrl, buyUrl)
	}

	private komaKoma() {
		const rootUrl = 'koma-koma'
		const name = 'Koma Koma'
		const artworkPath = `${this.dirKanez}${rootUrl}.jpg`
		const spotifyUrl = 'https://open.spotify.com/track/0Hbv3lJZvM3Bb9vhEcAAhi?si=c9036966188848a9'
		const buyUrl = 'https://www.qobuz.com/album/koma-koma-kanez-kane/vmzznxtf4kyna'
		const about = `This second song release by Kanez Kane, 15th January 2023. Jump and join the Revolution!<br>
		<br>LYRICS<br>
		Verse 1:<br>
		His name was Koma Koma, he had to move around.<br>
		Heard he came from Bangaboo, the dark side of town.<br>
		50 years in coma, still looking 22, I thought he was a miracle too.<br>
		Pre-chorus:<br>
		Oh, he sees you, feels you, calls out your name, and tells us stories of time.<br>
		Chorus:<br>
		Oh, the nights were so long, we kept playing along, talking about revolution.<br>
		Oh, the people were kind, they got into your mind, talking about revolution.<br>
		Post-chorus:<br>
		Revolution (everybody do what I say), in the mind (everybody jump).<br>
		Revolution (everybody do what I say), in the heart (everybody jump).<br>
		Verse 2:<br>
		He was always moving, never standing still.<br>
		Had a vision of the world, was willing to kill.<br>
		Put you in a koma, there's magic in his eyes, you would always follow his will.<br>
		Pre-chorus -> Chorus -> Post-chorus<br>
		Bridge:<br>
		Jump, jump, jump, jump, jump, jump, jump, jump...<br>
		Revolution, revolution, revolution of the mind.<br>
		But they're out of their mind, of their mind, of their mind!<br>
		Chorus -> Post-chorus<br>
		Post-chorus outro:<br>
		Revolution (got a message to the whole / free generation).<br>
		Revolution (got a message to the heart).<br>`

		return new YoutubeTrack('Ww4w8prWBxM', false,  rootUrl, name, artworkPath, about, '', spotifyUrl, buyUrl)
	}

	private strawberryCityLights() {
		const rootUrl = 'strawberry-city-lights'
		const name = 'Strawberry City Lights'
		const artworkPath = `${this.dirKanez}${rootUrl}.jpg`
		const spotifyUrl = 'https://open.spotify.com/track/0lRUvYevsLK5pBrTYfl3be?si=04526be015af456e'
		const buyUrl = 'https://www.qobuz.com/album/strawberry-city-lights-kanez-kane/qhcm8paksnp5a'
		const about = `This first song release by Kanez Kane, 15th December 2022.<br>
		<br>LYRICS<br>
		Verse 1:<br>
		Rose, fame, forever, forever.<br>
		Going home, oh, it went sideways.<br>
		Birds, bees, forever, forever.<br>
		Growing tall, oh, wait for Fridays.<br>
		Chorus:<br>
		Strawberry city lights, angels shine every night.<br>
		No turn here makes it right, I'm waiting at the gate.<br>
		Perfume and ecstasy, Candyman sets you free.<br>
		Love, guns and sticky nuns, they'll / please help me find my way.<br>
		Verse 2:<br>
		Gone, dead, forever, forever.<br>
		Going home, oh, 6 feet under.<br>
		Stars, light, oh never, oh never.<br>
		Growing old, oh, makes you wonder.<br>
		-> Chorus<br>
		Verse outro:<br>
		Rose, fame, forever, forever.<br>
		Going home, oh, 6 feet under.<br>`

		return new YoutubeTrack('DTmPz-vSTFI', false,  rootUrl, name, artworkPath, about, '', spotifyUrl, buyUrl)
	}

	private tonisTimeMachine() {
		const rootUrl = 'tonis-time-machine'
		const name = "Toni's Time Machine"
		const artworkPath = `${this.dirKanez}${rootUrl}.jpg`
		const spotifyUrl = 'https://open.spotify.com/track/2RLL2jOutw0X6xoJuxOl2u?si=4d0cc6b104f943a0'
		const buyUrl = 'https://www.qobuz.com/album/tonis-time-machine-kanez-kane/f0thz4tnngdxc'
		const about = `Currently the latest Kanez Kane song release, 26th May 2023. Composed during the 1st Stockholm music session (<a href="https://www.f6s.com/member/sindribergmannrarinsson#about">Sindri</a> visited me).<br>
		<br>LYRICS<br>
		Chorus:<br>
		Toni's living in the past...<br>
		Verse 1:<br>
		Toni was a man, trapped, lost in the past.<br>
		Lived in his stories, old times were his way, but<br>
		Toni was ashamed, felt guilty of lies.<br>
		Invented the greatest machine of all time.<br>
		-> Chorus<br>
		Verse 2:<br>
		Toni traveled time, loved getting away.<br>
		While sitting still in his room every day, but<hbr>
		Toni's mission failed when blowing a fuse.<br>
		Short circuit accident, stuck in the room.<br>
		-> Chorus`

		return new YoutubeTrack('J4h4s7IQSSs', false,  rootUrl, name, artworkPath, about, '', spotifyUrl, buyUrl)
	}

	private pesi2002() {
		const rootUrl = 'pesi-year-2002'
		const name = 'Pési (year 2002)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/pesi-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/6viU3JhxNEKkY2paBuOEaP'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private mouse2002() {
		const rootUrl = 'mouse-year-2002'
		const name = 'Mouse (year 2002)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/mouse-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/1f2eGiZiCMOMZZbKc52IIH'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002 + ' I did my take on the lyrics, thus differing to some extent.'
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private rubber2002() {
		const rootUrl = 'rubber-year-2002'
		const name = 'Rubber (year 2002)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/rubber-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/23kZ3ftMMyigpXU49Rq35Q'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private solos2002() {
		const rootUrl = 'solos-year-2002'
		const name = 'Solos (year 2002)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/solos-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5J8kU1mdqcqKZ0Wb3sxrqj'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

		private takeCare2002() {
			const rootUrl = 'take-care-year-2002'
			const name = 'Take Care (year 2002)'
			const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/take-care-year-2002?in=egill-antonsson/sets/braedraminning'
			const spotifyUrl = 'https://open.spotify.com/track/6xiCd9HFh0SaJEngXtgldj'
			const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
			const about = this.aboutBraedraminningTake2002
			return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
		}

		private beLikeYou2002() {
			const rootUrl = 'be-like-you-year-2002'
			const name = 'Be Like You (year 2002)'
			const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/be-like-you-year-2002?in=egill-antonsson/sets/braedraminning'
			const spotifyUrl = 'https://open.spotify.com/track/4zcgAvMsU46YVTKGmS8vJA'
			const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
			const about = this.aboutBraedraminningTake2002
			return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
		}

	private story2002() {
		const rootUrl = 'story-year-2002'
		const name = 'Story (year 2002)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/story-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/0zcnfEWqzmaCfp7hsbcA9Z'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002 +  `I increased the drama in the lyrics e.g. by knocking the headmaster OUT, instead of DOWN (I don't remember if it specific thing was intentional or not.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private frumlag2002() {
		const rootUrl = 'frumlag-year-2002'
		const name = 'Frumlag (year 2002)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/frumlag-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5fFuGjJMqLS0iPMmiZ3SBc'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private world2002() {
		const rootUrl = 'world-year-2002'
		const name = 'World (year 2002)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/world-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5EFT7M2r9kiJqPn2EtXNoz'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002  + ` I think I increased the drama in the lyrics with 'The world is nothing except hate' as it could be that Egill sung 'The world is nothing I say Hey'. I also added lyrics where they were missing or unclear.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private withoutThem2002() {
		const rootUrl = 'without-them-year-2002'
		const name = 'Without them (year 2002)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/without-them-year-2002?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5cfstB4Y5eIFI79e4KBAk8'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = this.aboutBraedraminningTake2002  + ` I kept with the 'no no no' like in the original, and additionally went ALL IN on other verbal sounds.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private myDearOldBrothers() {
		const rootUrl = 'my-dear-old-brothers'
		const name = 'My Dear Old Brothers'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/my-dear-old-brothers?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/6mnJyUYVPeoEx8oKUBu4Zw'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = `I saw a chord progression with the title 'Lady Lobo' written in a note book that belonged to my brothers. I thought this might be an original song and thus wanted to bring it to life for the album. I shaped the song, found the melody and lyrics and re-titled and performed it. It ends with traveling back in time to the 70s and the original songs.
`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private braedraminning70s = `Recorded with their band Lazarus or Fló (not sure which one)`
	private circa70sYear = `I'm guessing a bit on the year of this recording`
	private lazarusOrFlo = `guitar: Árni Björnsson or Júlíus Jónasson, bass: Páll Hartmannsson or Einar Arngrímsson, drums: Hermann Tómasson or Vignir Hallgrímsson`

	private pesi1974() {
		const rootUrl = 'pesi-year-1974'
		const name = 'Pési (year 1974)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/pesi-year-1974?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/5wmAzE3Mc0uWjhjxRf95OQ'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about = `Jónas wrote this song for Egill to play on the wurlitzer piano. ${this.braedraminning70s}. ${this.circa70sYear}. Wurlitzer piano: Egill,
guitar: Jónas, ${this.lazarusOrFlo}.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private mouse1975() {
		const rootUrl = 'mouse-year-1975'
		const name = 'Mouse (year 1975)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/mouse-year-1975?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/3qtGfywTgrjxBMQcCdN1xo'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `${this.braedraminning70s}. ${this.circa70sYear}. Vocals and wurlitzer piano: Egill, guitar: Jónas, ${this.lazarusOrFlo}.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private rubber1975() {
		const rootUrl = 'rubber-year-1975'
		const name = 'Rubber (year 1975)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/rubber-year-1975?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/700fVJsCrH4BBpsMW7B60t'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `${this.braedraminning70s}. ${this.circa70sYear}. Vocals and wurlitzer piano: Egill, guitar: Jónas and background vocals, ${this.lazarusOrFlo}.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private solos1975() {
		const rootUrl = 'solos-year-1975'
		const name = 'Solos (year 1975)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/solos-year-1975?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/3X7wZlcTxFwkLs7rvEkkWZ'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `${this.braedraminning70s}. ${this.circa70sYear}. Organ: Egill, guitar: Jónas, ${this.lazarusOrFlo}.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

		private takeCare1976() {
			const rootUrl = 'take-care-year-1976'
			const name = 'Take Care (year 1976)'
			const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/take-care-year-1976?in=egill-antonsson/sets/braedraminning'
			const spotifyUrl = 'https://open.spotify.com/track/2V0X8p2Tefcg5MTrnuuplo'
			const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
			const about =  `Egill playing by himself. It feels to me that this is shortly after Jónas is gone but I'm not sure, ${this.circa70sYear}.`
			return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
		}

		private beLikeYou1976() {
			const rootUrl = 'be-like-you-year-1976'
			const name = 'Be Like You (year 1976)'
			const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/be-like-you-year-1976?in=egill-antonsson/sets/braedraminning'
			const spotifyUrl = 'https://open.spotify.com/track/23YxXCBVwziMTdJnIGqLZx'
			const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
			const about =  `Egill playing by himself. It feels to me that this is shortly after Jónas is gone but I'm not sure, ${this.circa70sYear}.`
			return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
		}

	private story1976() {
		const rootUrl = 'story-year-1976'
		const name = 'Story (year 1976)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/story-year-1976?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/47Tf6lPTTaibh0LFGi6ULh'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Egill playing by himself. It feels to me that this is shortly after Jónas is gone but I'm not sure, ${this.circa70sYear}.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private frumlag1977() {
		const rootUrl = 'frumlag-year-1977'
		const name = 'Frumlag (year 1977)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/frumlag-year-1977?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/1TV6QGFbW0mdtO8GqXCfay'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Egill playing the organ with couple of band mates who play guitar, bass and a 'drum', who could be (I'm not sure) Árni Björnsson or Júlíus Jónasson or Páll Hartmannsson or Einar Arngrímsson or Hermann Tómasson or Vignir Hallgrímsson.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private world1977() {
		const rootUrl = 'world-year-1977'
		const name = 'World (year 1977)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/world-year-1977?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/6dI0WypRxmbUK7Rw9TaHpT'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Egill playing the organ and singing with couple of band mates who play guitar and bass, who could be (I'm not sure) Árni Björnsson or Júlíus Jónasson, Páll Hartmannsson or Einar Arngrímsson`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private withoutThem1977() {
		const rootUrl = 'without-them-year-1977'
		const name = 'Without them (year 1977)'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/without-them-year-1977?in=egill-antonsson/sets/braedraminning'
		const spotifyUrl = 'https://open.spotify.com/track/0rcIAwxbRtRhYbKX0bq142'
		const buyUrl = 'https://www.qobuz.com/album/braeraminning-in-memory-of-the-brothers-egill-antonsson/pa3y1de6ejnqb'
		const about =  `Egill singing and playing the guitar with the drums from the Yamaha organ. But it could be that someone else is playing the guitar and then likely Árni Björnsson or Júlíus Jónasson.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathBraedraminningArtwork, about, spotifyUrl, buyUrl)
	}

	private votThemeSong() {
		const rootUrl = 'vikings-of-thule-theme-song'
		const name = 'Vikings of Thule Theme Song'
		const artworkPath =  `${this.dirEgillAntonsson}${rootUrl}.PNG`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/vikings-of-thule-theme-song'
		const spotifyUrl = 'https://open.spotify.com/track/35LOjco7IykC60Pqq3DjuU?si=7245ec4caae24d82'
		const buyUrl = 'https://www.qobuz.com/album/vikings-of-thule-theme-song-with-jonas-antonsson-julius-jonasson-egill-antonsson/k6jzobz1suzjb'
		const about = `The song for the Vikings of Thule video teaser. VoT was a game made by the company ${this.urlGogogic}. Lyrics by Jónas B. Antonsson, composed by Jónas and me, performed by me and mixed and produced by Júlíus Jónasson. <a href="http://www.77.is" target="_blank">Dóri</a> created the video and synced to the song. Image artwork made by Þórir Karl Bragason Celin.<br>
		<br>Lyrics:<br>
		Snjóar kaldri ströndu á, sefur jökulfoldin<br>
		Varin öllum vættum þá, vistinn blóði goldin<br>
		Tungl er horfið sól er sest, ennþá mun hún rísa<br>
		Víkingum hún vandar mest, í vonar landi ísa<br>
		<br>Translated to English:<br>
		Snow falls on a cold beach, the frozen earth is sleeping<br>
		Guarded by all wights, thus staying will cost blood<br>
		The moon has gone the sun has set, but she will rise again<br>
		For the vikings that settled and stayed, in a land of ice and hope`

		return new YoutubeTrack('EiiR4cwjNwY', true, rootUrl, name, artworkPath, about, soundcloudUrl, spotifyUrl, buyUrl)
	}

	private harmoniesOfShadeAndLight() {
		const rootUrl = 'harmonies-of-shade-and-light'
		const name = 'Harmonies of Shade and Light'
		const artworkPath =  `${this.dirEgillAntonsson}${rootUrl}.jpg`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/harmonies-of-shade-and-light'
		const spotifyUrl = 'https://open.spotify.com/track/1xHXUKERh3a6elM9VdPIUW'
		const buyUrl = 'https://www.qobuz.com/album/harmonies-of-shade-and-light-egill-antonsson/y84mz2hhlrtbc'
		const about = `I got the idea of this song when I was with the family in Thailand at the beginning of 2017. I borrowed a guitar with missing strings and created a harmony pattern and sung a melody over it. In circa 2019 I recorded the guitars and arranged the percussions from <a href="https://www.thelooploft.com/collections/drum-loops" target="_blank">The Loop Loft</a>. In the spring of 2021 my friend and music partner <a href="https://www.f6s.com/member/sindribergmannrarinsson#about">Sindri Bergmann Thorarinsson</a> helped me structure the song and write the lyrics,
and he recorded my vocals in his studio in Reykjavik. In April 2022 I recorded the rest of the instruments, processed and mixed the song.<br>
<br>LYRICS<br>
Verse 1:<br>
Someday's, the skies are cloudy.<br>
Someday's, there is no light.<br>
Pre-Chorus:<br>
And I thank you, for all the times we had.<br>
And I thank you, for the moments that you cared.<br>
Chorus:<br>
Stars are shining bright tonight.<br>
Harmonies of shade and light.<br>
And everything's alright.<br>
Verse 2:<br>
I smile, though the skies are cloudy.<br>
And I shine, when there's no light.<br>
-> Pre-Chorus -> Chorus...
`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, artworkPath, about, spotifyUrl, buyUrl)
	}

	private weWillMeetAgain() {
		const rootUrl = 'we-will-meet-again'
		const name = 'We Will Meet Again'
		const artworkPath = `${this.dirEgillAntonsson}${rootUrl}.jpg`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/we-will-meet-again'
		const spotifyUrl = 'https://open.spotify.com/track/27t1JaFQlOX6hhkVC6d59Z'
		const buyUrl = 'https://www.qobuz.com/album/we-will-meet-again-egill-antonsson/hytrd9qqfadib'

		const about = `In the spring of 2021, my friend and music partner, <a href="https://www.f6s.com/member/sindribergmannrarinsson#about">Sindri Bergmann Thorarinsson</a>, approached me with an exciting proposition: to collaborate on a pop song. While we had dabbled in pop music in the past, this was the first time we dedicated ourselves to crafting and producing a contemporary pop track. We set ourselves a tight deadline of just a couple of days (both to train our production speed, and as I would return to Stockholm shortly after). Together we crafted both the music and lyrics (inspired by the reality that due to Covid restrictions it had been awhile since we'd met). I contributed my vocals to the lyrics, while Sindri expertly mixed and polished the song.<br>
<br>Lyrics:<br>
Verse 1:<br>
Woke up this morning late, it was half past 8, still stuck in the rhythm.<br>
You feel so far away, life's so dull and grey, when we're not together.<br>
Pre-Chorus:<br>
But I know, there's a place, you and I will meet again.<br>
And I know, that in time, you and I will meet again.<br>
Chorus:<br>
Though it feels far away, do the walk day by day, you and I will meet again.<br>
Though you are far away, we can talk every day, you and I will meet again.<br>
Verse 2:<br>
I tried to dance alone, to our favorite song, in front of the mirror.<br>
I miss your beat so much, and your caring touch, us two in the rhythm.<br>
-> Pre-Chorus -> Chorus<br>
Bridge:<br>
And we'll dance, you and I, to the off beat and the rhythm.<br>
And we'll joke, and we'll laugh, what a great time we'll have, when I'll meet you in heaven.<br>
-> Chorus`

		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, artworkPath, about, spotifyUrl, buyUrl)
	}

	private magmaMerryGoRound() {
		const rootUrl = 'magma-merrygoround'
		const name = 'Magma MerryGoRound'
		const artworkPath = `${this.dirEgillAntonsson}${rootUrl}.jpg`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/magma-merrygoround'
		const spotifyUrl = 'https://open.spotify.com/track/06bQmD7bI6N1qGDeIVsGYR'
		const buyUrl = 'https://www.qobuz.com/album/magma-merrygoround-egill-antonsson/bqp8z0xr9lqja'
		const about = `Debuted at the 2021 <a href="https://edisonparty.com" target="_blank">Edison demoparty</a> under my pseudonym, Vulkanoman, this creation was initially named 'Tivoli Chase Cop 27/16.' However, the inspiration struck me during the then recent journey where I witnessed the live volcanic eruption at <a href="https://en.wikipedia.org/wiki/Fagradalsfjall">Fagradallsfjall in Iceland</a>, leading me to retitle the track.`

	return new SoundcloudTrack(soundcloudUrl, rootUrl, name, artworkPath, about, spotifyUrl, buyUrl)
	}

	private justInTime() {
		const rootUrl = 'just-in-time'
		const name = 'Just in Time'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/just-in-time'
		const about = `Debuted at the 2020 <a href="https://edisonparty.com" target="_blank">Edison demoparty</a> under my pseudonym Undur (now my current pseudonym is Vulkanoman). The title is a reference to the fact that I finished the song just in time for the party, and having missed the deadline the year before...`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, Track.defaultArtworkPath, about)
	}

	private icelandSocksIntro() {
		const rootUrl = 'iceland-socks-intro'
		const name = 'Iceland Socks: Intro'
		const artworkPath = `${this.dirEgillAntonsson}${rootUrl}.jpg`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/iceland-socks-intro'
		const about = `<a href="https://www.f6s.com/member/sindribergmannrarinsson#about">Sindri Bergmann Thorarinsson</a> and me made this for an Icelandic travel industry campaign that the company ${this.urlGogogic} created in 2008. The talented Gogogic employees were the puppeteers and you can watch the Iceland Socks Outtakes on <a href="https://youtu.be/6n3_NF0g2dg" target="_blank">YouTube</a>`
	return new SoundcloudTrack(soundcloudUrl, rootUrl, name, artworkPath, about)
	}

	private fortidin() {
		const rootUrl = 'fortidin'
		const name = 'Fortíðin'
		const artworkPath = `${this.dirEgillAntonsson}${rootUrl}.jpg`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/fortidin'
		const about = `Composed by Sigurjón Alexandersson and me. Sigurjón played the guitar, Sandra Ósk Snæbjörnsdóttir played the cello, vocals and other instruments performed by me. <a href="https://www.f6s.com/member/sindribergmannrarinsson#about">Sindri Bergmann Thorarinsson</a> assisted me with recording and mixing.<br>
		<br>LYRICS<br>
		Verse 1:<br>
		Þitt blíða bros, gæti brætt allan heiminn.<br>
		Augun blá, svo himnesk og dreymin.<br>
		Hlæjandi, hamingjan smitar mig.<br>
		Syngjandi, beint frá sálinni.<br>
		Chorus:<br>
		Er ég horfi á þig þá finn ég kærleik þinn.<br>
		Er ég hlusta á þig þá sefast hugur minn.<br>
		En þú ert fortíðin.<br>
		Verse 2:<br>
		Örlögin, tóku þig frá mér.<br>
		Örlögin, skildu mig eftir hér.<br>
		Það eina sem hjá mér eftir er, eru myndir upp á vegg, gamlar upptökur, og góðar minningar.<br>
		-> Chorus`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, artworkPath, about)
	}

	private toddlerTune() {
		const rootUrl = 'toddlers-tune'
		const name = 'Toddlers Tune'
		const artworkPath = `${this.dirEgillAntonsson}${rootUrl}.jpg`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/toddler-tune'
		const about = `When my daughter, Soffía Rós Egilsdóttir, was around 3 years old, I captured a precious moment of her singing a delightful melody. Inspired by her tune, I embarked on a creative journey, crafting chords and rhythm to complement her sweet voice. This harmonious fusion evolved into this song, that I aptly titled 'Toddler's Tune'`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, artworkPath, about)
	}

	private oddTimesInSpace() {
		const rootUrl = 'odd-times-in-space'
		const name = 'Odd Times in Space'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/odd-times-in-space'
		const about = `Inaugurated at the 2016 <a href="https://edisonparty.com" target="_blank">Edison demoparty</a> under my former pseudonym 'Undur' (now known as 'Vulkanoman'), the composition bears a title inspired by its odd time signature, odd drum beat emphasis at times, and 'space-like' ambiance (whatever that means).`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, Track.defaultArtworkPath, about)
	}

	private introduction() {
		const rootUrl = 'introduction'
		const name = 'Introduction'
		const artworkPath = `${this.dirTribeOfOranges}${rootUrl}.jpg`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/introduction'
		const about = `${this.urlSindri()} and I created this track for a theater play, we called it Introduction as it was played in the beginning. We incorporated drums played by <a href="https://www.discogs.com/artist/429294-Birgir-Baldursson" target="_blank">Birgir Baldursson</a>, that we initially recorded for another track I had composed (yet to be released). We took great care to produce the bassdrum sound, and we gave it a lot of space in the lower frequencies as the bass guitar only joins in the climax, while the guitar, piano and our voices float above in the higher frequencies. <a href="https://soundcloud.com/maniacs-of-noise" target="_blank">Maniacs of Noise / Jeroen Tel</a> commented on this track on Soundcloud, saying: "The best thing about this song is the bassdrum (that's not meant as an insult, it truly stands out!). :-)".<br>
		When I decided to share this track with the world, I opted for a distinct track artwork unrelated to the play. The artwork chosen was Indíánahöfuðið, a sculpture created by my oldest brother, Jónas. This potent piece holds immense sentimental value as a treasured family artifact, representing a Native American figure. Listening to the track, I envision a captivating tale of the clash of cultures, where the old meets the new, the past intertwines with the present, and the native converges with the foreign.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, artworkPath, about)
	}

	private routine() {
		const rootUrl = 'routine'
		const name = 'Routine'
		const artworkPath = `${this.dirTribeOfOranges}tribe-of-oranges.jpg`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/routine'
		const about = `${this.urlSindri()} and I explored the untapped potential of everyday household objects found within the confines of my apartment. We crafted a composition that entailed a minimalist electric piano chord progression complemented by a touch of didgeridoo randomness. The artwork for this track captures a candid moment of camaraderie, as we engaged in a friendly game of chess on my apartment's balcony. The photo reveals us adorned in cozy gloves and hats, testament to the sunny yet brisk winter day that accompanied our artistic pursuits.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, artworkPath, about)
	}

	private hhiCommercial() {
		const rootUrl = 'song-for-hhi-commercial'
		const name = 'Song for HHI commercial'
		const artworkPath = `${this.dirTribeOfOranges}tribe-of-oranges.jpg`
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/song-for-hhi-commercial'
		const about = `${this.urlSindri()} and I performed a song for Happdrætti Háskóla Íslands (University of Iceland Lottery) for their video commercial campaign where the company provided the predefined lyrics, melody and chord guideline. Since this was for a lottery commercial we recorded various coins sounds and made that part of the song. The best entries were filmed as commercials with the artists and aired, and we were among those. It was aired in the winter of 2008, if memory serves me right.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, artworkPath, about)
	}

	private get kuaiBuyUrl() {
		return 'https://www.qobuz.com/album/kuai-kuai/kqeu1azl013da'
	}

	private andefniLive() {
		const rootUrl = 'andefni-live'
		const name = 'Andefni - Live'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/andefni'
		const spotifyUrl = 'https://open.spotify.com/track/0BeH2MfJp85TtdE5PZ16PU?si=50aea94a99c5455f'
		const about = `Performed Live in Laugardalshöll 2nd of june 2001 at the Reykjavik Mini Festival. In the end ${this.urlSiggi()} shreds his guitar to smithereens.`
		return new YoutubeTrack('6cLPGWQJ2Vs', true,  rootUrl, name, this.pathKuaiArtwork, about, soundcloudUrl, spotifyUrl, this.kuaiBuyUrl)
	}

	private pirringurLive() {
		const rootUrl = 'pirringur-live'
		const name = 'Pirringur - Live'
		const soundcloudUrl = 'https://soundcloud.com/kuai-iceland/pirringur-live'
		const spotifyUrl = 'https://open.spotify.com/track/1MnsPzWXUWDdBjLGreX9mp?si=bbfd84374fd24935'
		const about = `Performed Live in Laugardalshöll 2nd of June 2001 at the Reykjavik Mini Festival. We started with this track on concerts and thus also on this concert.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, about, spotifyUrl, this.kuaiBuyUrl)
	}

	private pirringur() {
		const rootUrl = 'pirringur'
		const name = 'Pirringur'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/pirringur'
		const spotifyUrl = 'https://open.spotify.com/track/1MnsPzWXUWDdBjLGreX9mp?si=bbfd84374fd24935'
		const about = `Pirringur means irritation in Icelandic. We started with this track on concerts and thus it was fitting to start the album with it. The Hammond organ in the end was played by my and recorded by ${this.urlSteini()} in the FÍH concert hall.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, about, spotifyUrl, this.kuaiBuyUrl)
	}

	private apollo() {
		const rootUrl = 'apollo'
		const name = 'Apollo'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/apollo'
		const spotifyUrl = 'https://open.spotify.com/track/3ayL6r8u4hkHZzLFSGLq5j?si=42bf7eb320d14012'
		const about = `"The name of this track draws inspiration from the Apollo program (an iconic chapter in space history named after Apollo, the Greek god of light, music, and the Sun). In my artistic vision, this track embodies a space mission that ultimately culminates in a dramatic and intense catastrophic failure.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, about, spotifyUrl, this.kuaiBuyUrl)
	}

	private andsetinn() {
		const rootUrl = 'andsetinn'
		const name = 'Andsetinn'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/andsetinn'
		const spotifyUrl = 'https://open.spotify.com/track/7MRGsSRocQ9CUEP7MzzutU?si=39de5d4ba04f4ded'
		const about = `Andsetinn means possessed in Icelandic which is fitting for this track. The Yamaha C-35 organ and Hammond organ in the end were played by me.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, about, spotifyUrl, this.kuaiBuyUrl)
	}

	private hamskipti() {
		const rootUrl = 'hamskipti'
		const name = 'Hamskipti'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/hamskipti'
		const spotifyUrl = 'https://open.spotify.com/track/03YyiL49fyp9pPoynSk0e5?si=cd62c0313293492f'
		const about = `Hamskipti means shape-shifting or transformation in Icelandic, and are common themes in mythology and folklore, including the Icelandic Viking sagas. I heavily slap the bass in this one.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, about, spotifyUrl, this.kuaiBuyUrl)
	}

	private rover() {
		const rootUrl = 'rover'
		const name = 'Rover'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/rover'
		const spotifyUrl = 'https://open.spotify.com/track/2nM3ir2HXQIYx9HHdYgu3c?si=731010727fb94acc'
		const about = `Rover was recorded and mixed by Jón Elvar Hafsteinsson in 1999. Jón said that he had never recorded so much anger before (you can hear ${this.urlSteini()} and me screaming in the background in the metal parts which ends with the word "Mamma").  When we were thinking about what to name the track we found the name Rover on some card board in my parents garage which was our main rehearsal space at the time.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, about, spotifyUrl, this.kuaiBuyUrl)
	}

	private andefni() {
		const rootUrl = 'andefni'
		const name = 'Andefni'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/andefni'
		const spotifyUrl = 'https://open.spotify.com/track/0BeH2MfJp85TtdE5PZ16PU?si=50aea94a99c5455f'
		const about = `Andefni means antimatter in Icelandic. Steinar Sigurðsson plays the saxophone where the wired guitar play from ${this.urlSteini()} fills in the void. Then in the end ${this.urlSiggi()} shreds his guitar to smithereens.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, about, spotifyUrl, this.kuaiBuyUrl)
	}

	private agndofa() {
		const rootUrl = 'agndofa'
		const name = 'Agndofa'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/agndofa'
		const spotifyUrl = 'https://open.spotify.com/track/39v1wVL4fWnPWEt8D8tl40?si=500e84677daa4aec'
		const about = `Andefni means stunned in Icelandic. By coincidence during the long guitar feedback some radio broadcast came through the speakers, and we decided to keep it in the track.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, about, spotifyUrl, this.kuaiBuyUrl)
	}

	private ofurte() {
		const rootUrl = 'ofurte'
		const name = 'Ofurte'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/ofurte'
		const spotifyUrl = 'https://open.spotify.com/track/1deKl4F86Lns3pgbeQspyw?si=536593297c194d76'
		const about = `Ofurte translates to "super tea" in Icelandic. Both during concerts and on the album, this track marks the final part of the musical journey, starting with a mellow melody pattern. The  Hammond organ solo at the end was played by me and recorded by ${this.urlSteini()} at the FÍH concert hall.`
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, about, spotifyUrl, this.kuaiBuyUrl)
	}

	private get aboutLesblinda() {
		return `Lesblinda means dyslexia in Icelandic. Initially, we called both parts (I and II) "Korterið," meaning quarter in Icelandic, as it typically spanned about a quarter of an hour in performance time. However, the length remained open-ended due to the improvised and interwoven guitar melodies, guided by occasional cues signaling section changes. A memorable aspect of our live performances was concluding with "Korterið," where part I exudes a mellow ambiance and Part II serves as a contrasting, climactic power blast. In the studio recording ${this.urlSiggi} played the piano, and I played the Hammond organ.`
	}

	private lesblindaI() {
		const rootUrl = 'lesblinda-i'
		const name = 'Lesblinda I'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/lesblinda-i'
		const spotifyUrl = 'https://open.spotify.com/track/6ZPVNTF0o9B79SGKRulrUh?si=4a0d989e1c674d53'
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, this.aboutLesblinda, spotifyUrl, this.kuaiBuyUrl)
	}

	private lesblindaII() {
		const rootUrl = 'lesblinda-ii'
		const name = 'Lesblinda II'
		const soundcloudUrl = 'https://soundcloud.com/egill-antonsson/lesblinda-ii'
		const spotifyUrl = 'https://open.spotify.com/track/6tOuId7SigO9IMiUwaavCU?si=e1bf6a3f596c4da6'
		return new SoundcloudTrack(soundcloudUrl, rootUrl, name, this.pathKuaiArtwork, this.aboutLesblinda, spotifyUrl, this.kuaiBuyUrl)
	}


	private godsruleLayered() {
		const rootUrl = 'godsrule-village'
		const name = 'Godsrule: Village'
		const about = `I composed and produced the music and sfx for this gamet. The Village music track has 4 layers — village ambience, string and male choir (me) harmony chords, harp arpeggio chords, and piano melody.`

		const track = new LayeredMusicTrack(
			new LayeredMusicController(this.instanceEndedListeners, this.logService.log),
			[
				SoundData.musicLoop('godsruleEnvironmentLayer', `${this.dirGameMusicLayered}/loton_MusicVillageEnvironmentLayer.ogg`, 0.075),
				SoundData.musicLoop('godsruleStringLayer', `${this.dirGameMusicLayered}/loton_MusicVillageStringLayer.ogg`, 0.55),
				SoundData.musicLoop('godsruleHarpLayer', `${this.dirGameMusicLayered}/loton_MusicVillageHarpLayer.ogg`, 0.4),
				SoundData.musicLoop('godsrulePianoLayer', `${this.dirGameMusicLayered}/loton_MusicVillagePianoLayer.ogg`, 0.35)
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
			}, rootUrl, name, `${Track.dir}/game/music-layered/godsrule-village.webp`, about
		)
		return track
	}

	private votLayered() {
		const rootUrl = 'vikings-of-thule-map'
		const name = 'Vikings of Thule: Map'
		const about = `I composed and produced the music and sfx for this game. The Map music track has 4 layers — village ambience, string and male choir (me) harmony chords, harp arpeggio chords, and piano melody.`

		const track = new LayeredMusicTrack(
			new LayeredMusicController(this.instanceEndedListeners, this.logService.log),
			[
				SoundData.musicLoop('votWindLayer', `${this.dirGameMusicLayered}/VOT_InterfaceMusic_0.mp3`),
				SoundData.musicLoop('votChoirLayer', `${this.dirGameMusicLayered}/VOT_InterfaceMusic_3.ogg`),
				SoundData.musicLoop('votHarpLayer', `${this.dirGameMusicLayered}/VOT_InterfaceMusic_2.ogg`),
				SoundData.musicLoop('votMelodyLayer', `${this.dirGameMusicLayered}/VOT_InterfaceMusic_1.ogg`)
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
			}, rootUrl, name, `${this.dirGameMusicLayered}/${rootUrl}.jpg`, about)
		return track
	}

	private cakePopParty() {
		const rootUrl = 'cake-pop-party'
		const name = 'Cake Pop Party'
		const about = `I composed and produced the music and sfx for this game. I was inspired by the intro of <a href="https://open.spotify.com/track/3qI94hINNNeb4S7xQi18lS?si=daef63ec063e4901" target="_blank">Blame it on the Boogie by The Jacksons</a>. This track starts with the Intro music looped twice, then goes into the in-game 'Make the Pop' music. Then the whole thing is looped twice. A short description of the game: A social entertainment game for the iPad and iPhone. The key ingredient of the game is the ability of players to create, design and share their unique cake pop creations globally within the app and on the social networks for added fun. Developed by ${this.urlGogogic} and published by <a href="https://www.facebook.com/profile.php?id=100063882670798" target="_blank">FreshGames</a>.`

		const track = new LocalTrack(
			[
				SoundData.music('cppMusicIntro', `${this.dirGameMusic}/CPP_workMusicIntroScreen.ogg`, 0.7),
				SoundData.music('cppMusicScaleBeat', `${this.dirGameMusic}/CPP_musicTransitionBeatFade.ogg`, 0.6),
				SoundData.music('cppMusicMakePop', `${this.dirGameMusic}/CPP_workMusicMakePopLoop.ogg`, 0.7),
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
			}, rootUrl, name, `${this.dirGameMusic}/cake-pop-party.png`, about)
		return track
	}

	private symbol6() {
		const rootUrl = 'symbol-6'
		const name = 'Symbol 6'
		const about = `I composed and produced the music and sfx for this game. I was a bit inspired by the song <a href="https://soundcloud.com/r-nar-li-bjarnason/easy-cream?in=r-nar-li-bjarnason/sets/fiff" target="_blank">Easy Cream by the band Fiff</a> as I use the same verse chord progression, but I change the time signature from 4 to 6. This track starts with the drum beat that was during the menu, then goes into the in-game music, and goes into the old version of the in-game music (with less drums). Then the whole thing is looped twice. Developed and by published by ${this.urlGogogic}`

		const track = new LocalTrack(
			[
				SoundData.music('ssixMenu', `${this.dirGameMusic}/SSIX_menu.ogg`),
				SoundData.music('ssixGame', `${this.dirGameMusic}/SSIX_game.ogg`),
				SoundData.music('ssixHexago', `${this.dirGameMusic}/SSIX_HexagoTune.ogg`),
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
			}, rootUrl, name, `${this.dirGameMusic}/symbol-6.jpg`, about)
		return track
	}

	private softFreakFiesta() {
		const rootUrl = 'soft-freak-fiesta'
		const name = 'Soft Freak Fiesta'
		const about = `I composed and produced the music and sfx for this game. This track starts with the Intro into menu music, then goes into in-game music. First with default level, then with bubbling acid / lava ambience level. Then the You Loose jingle is played, then the whole thing is looped twice, but now it ends with You Win jingle. Developed and by published by ${this.urlGogogic}`

		const track = new LocalTrack(
			[
				SoundData.music('sffIntroMenuMusic', `${this.dirGameMusic}/SFF_IntroMenuMusic.ogg`, 0.9),
				SoundData.music('sffMenuMusic', `${this.dirGameMusic}/SFF_MenuMusic.ogg`, 0.9),
				SoundData.music('sffLevelMusicNoEnv', `${this.dirGameMusic}/SFF_LevelMusic_noEnv.ogg`),
				SoundData.music('sffLevelMusicBubbling', `${this.dirGameMusic}/SFF_LevelMusic_bubbling.ogg`),
				SoundData.music('sffLoseJingle', `${this.dirGameMusic}/SFF_LoseJingle.ogg`, 0.9),
				SoundData.music('sffWinJingle', `${this.dirGameMusic}/SFF_WinJingle.ogg`, 0.9)
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
			}, rootUrl, name, `${this.dirGameMusic}/soft-freak-fiesta.jpg`, about)
		return track
	}

	private habitarium() {
		const rootUrl = 'habitarium'
		const name = 'Habitarium'
		const about = `I composed and produced the music and sfx for this <a href="https://www.neopets.com/habitarium/" target="_blank">game</a> that was developed by ${this.urlGogogic} but was for Neopets that was then owned by <aNickelodeon. This track starts with the main theme music and then goes into in-game music, then the whole thing is looped twice. After the delivery at some point the owners (maybe after change of ownership) added a music track that was not done by me.`

		const track = new LocalTrack(
			[
				SoundData.music('habitariumMainTheme', `${this.dirGameMusic}/Habitarium_main_theme.ogg`, 0.9),
				SoundData.music('habitariumInGameLoop', `${this.dirGameMusic}/Habitarium_InGameLoop.ogg`, 0.8)
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
			}, rootUrl, name, `${this.dirGameMusic}/habitarium.png`, about)
		return track
	}

	private tinyPlaces() {
		const rootUrl = 'tiny-places'
		const name = 'Tiny Places'
		const about = `I composed and produced the music and sfx for this game. This track starts with the intro music and then goes to the main theme music, where I was inspired by the <a href="https://open.spotify.com/track/5duZVZ4m1TaJDTCbeHG8TG?si=a7ac919c95274a51" target="_blank">Indiana Jones theme</a>. Then it goes to the Space Bonus Level where Nap floats in space, and where I was inspired by communication by the melody line in the movie <a href="https://www.youtube.com/watch?v=nkykqyMEarA" target="_blank">Close Encounters of the Third Kind</a>. Then it goes to the Pyramid Tomb Bonus Level. Then it goes the 'Lazy style', then it goes to a short xylophone cut scene and then the in-game music, and it ends with The Time is Running Out and Game Over. Developed by ${this.urlGogogic} and published by <a href="https://www.bigfishgames.com" target="_blank">Big Fish Games</a>.`

		const track = new LocalTrack(
			[
				SoundData.music('tpMainThemeIntro', `${this.dirGameMusic}/TP_mainThemeIntro.ogg`, 0.8),
				SoundData.music('tpMainThemeBridge', `${this.dirGameMusic}/TP_mainThemeBridge.ogg`, 0.8),
				SoundData.music('tpSpaceWorld', `${this.dirGameMusic}/TP_spaceWorld.ogg`, 0.8),
				SoundData.music('tpTomb', `${this.dirGameMusic}/TP_tomb.ogg`, 0.8),
				SoundData.music('tpLazyStyle', `${this.dirGameMusic}/TP_lazyStyle.ogg`, 0.8),
				SoundData.music('tpCutScene', `${this.dirGameMusic}/TP_cutScene.ogg`, 0.8),
				SoundData.music('tpInGame', `${this.dirGameMusic}/TP_inGame.ogg`, 0.8),
				SoundData.music('tpOutOfTime', `${this.dirGameMusic}/TP_outoftime.ogg`, 0.8),
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
			}, rootUrl, name, `${this.dirGameMusic}/tiny-places.jpg`, about)
		return track
	}

	private jol2008() {
		const rootUrl = 'christmas-game-2008'
		const name = 'Christmas Game 2008'
		const about = `I composed and produced the music and sfx for the 2008 Gogogic Christmas Game. It was a ${this.urlGogogic} tradition to publish a game each Christmas that people could play for free and get int the holiday spirit. This year the game was packaging christmas correctly and in due time. This track plays the the main music twice and  then ends with the Game Over jingle.`

		const track = new LocalTrack(
			[
				SoundData.music('jol2008mainMusic', `${this.dirGameMusic}/jolagogo2008_main_music.ogg`),
				SoundData.music('jol2008gameOver', `${this.dirGameMusic}/jolagogo2008_game_over.ogg`)
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
			}, rootUrl, name, `${this.dirGameMusic}/christmas-gogogic.jpg`, about)
		return track
	}

	private jol2009() {
		const rootUrl = 'christmas-game-2009'
		const name = 'Christmas Game 2009'
		const about = `I composed and produced the music and sfx for the 2009 Gogogic Christmas Game. It was a ${this.urlGogogic} tradition to publish a game each Christmas that people could play for free and get int the holiday spirit. This year the game was solving the christmas puzzle that pushing out slimy balls through some pipes, thus I shuffled and juiced up the comp around the same melody tones from last year's game. This track starts with the Bridge and then goes to the Chorus. Then the whole thing is looped twice.`

		const track = new LocalTrack(
			[
				SoundData.music('jol2009bridge', `${this.dirGameMusic}/jolagogo2009_Bridge.ogg`),
				SoundData.music('jol2009chorus', `${this.dirGameMusic}/jolagogo2009_Chorus.ogg`),
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
			}, rootUrl, name, `${this.dirGameMusic}/jol-gogogic.jpg`, about)
		return track
	}

	private whosYourFriend() {
		const rootUrl = 'whos-your-friend'
		const name = 'Who\'s Your Friend'
		const about = `I composed and produced the music and sfx for this game that was about knowing as many of your Facebook friend profile pictures (selected randomly) in 90 seconds, thus the track is the same length as the game sessions 90 seconds. Developed by ${this.urlGogogic}`

		const track = new LocalTrack(
			[SoundData.music('wyf',  `${this.dirGameMusic}/WYF_ThemeSong.ogg`)],
			() => {
				return async () => {
					const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
					const {instance, endedPromise} = await sound.play()
					this.instancePlayedListeners.forEach((listener) => listener(instance))
					await endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			}, rootUrl, name, Track.defaultArtworkPath, about)
		return track
	}

	private knowYourFriend() {
		const rootUrl = 'know-your-friend'
		const name = 'Know Your Friend'
		const about = `I composed and produced the music and sfx for this game that was about knowing as many of your Facebook friend profile pictures (presented 4 choices randomly) in 90 seconds. The track starts with 90 seconds game session then goes to the Game Finished and Result music with applause ambience (looped twice). Developed by ${this.urlGogogic}`

		const track = new LocalTrack(
			[
				SoundData.music('kyfIntroMusic', `${this.dirGameMusic}/KYF_IntroMusic_WithAudience.ogg`),
				SoundData.music('kyf90secMusic', `${this.dirGameMusic}/KYF_90secondsMusic.ogg`)
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
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			}, rootUrl, name, `${this.dirGameMusic}/know-your-friend.jpg`, about)
		return track
	}

	private stackem() {
		const rootUrl = 'stack-em'
		const name = 'Stack\'em'
		const about = `I composed and produced the music and sfx for this game that was about stacking your sheep as high as you can, competing for the high score with your fellow farmers. This track is looped twice. Developed by ${this.urlGogogic} and published by <a href="https://www.bigfishgames.com" target="_blank">Big Fish Games</a>.`

		const track = new LocalTrack(
			[SoundData.music('stackem', `${this.dirGameMusic}/Stackem_Tune_loop.ogg`, 0.9)],
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
			}, rootUrl, name, `${this.dirGameMusic}/stack-em.webp`, about)
		return track
	}

	private glowbulleville() {
		const rootUrl = 'glowbulleville'
		const name = 'Glowbulleville'
		const about = `I composed and produced the music and sfx for this game which was the first one I did at ${this.urlGogogic}. This track starts with the main music, then goes to the village music (looped twice), then goes to the in-game music, then the whole thing is looped twice.`

		const track = new LocalTrack(
			[
				SoundData.music('glowMainMusic', `${this.dirGameMusic}/GLOB_main_music.mp3`, 0.8),
				SoundData.music('glowVillageMusic', `${this.dirGameMusic}/GLOB_village_music.mp3`),
				SoundData.music('glowWack', `${this.dirGameMusic}/GLOB_wack_a_mole.mp3`, 0.8)
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
			}, rootUrl, name, Track.defaultArtworkPath, about)
		return track
	}

	private godsrule() {
		const rootUrl = 'godsrule-battle'
		const name = 'Godsrule: Battle'

		const track = new LocalTrack(
			[
				SoundData.music('godsruleBattle', `${this.dirGameMusic}/LOTON_BattleBaseLayer.ogg`),
				SoundData.music('godsruleDefeat', `${this.dirGameMusic}/LOTON_CombatDefeatMusic.ogg`),
				SoundData.music('godsruleVictory', `${this.dirGameMusic}/LOTON_CombatVictory.ogg`),
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
			}, rootUrl, name, `${this.dirGameMusic}/godsrule-battle.jpg`)
		return track
	}

	private vot() {
		const rootUrl = 'vikings-of-thule-duel'
		const name = 'Vikings of Thule: Duel'
		const about = `I composed and produced the music and sfx for this game. This track starts with the drums when the duel initiated popup displays, then goes to the duel music when the duel starts. The duel end popup queues the duel end music where the music ends (and wind ambience continues). Developed and published by ${this.urlGogogic}.`

		const track = new LocalTrack(
			[
				SoundData.music('votFeudDrums', `${this.dirGameMusic}/VOT_FeudMusic_drums.ogg`),
				SoundData.music('votFeud', `${this.dirGameMusic}/VOT_FeudMusic.ogg`),
				SoundData.music('votFeudEnding', `${this.dirGameMusic}/VOT_FeudEnding.ogg`),
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
			}, rootUrl, name, `${this.dirGameMusic}/${rootUrl}.jpg`, about)
		return track
	}

	private crisisGame() {
		const rootUrl = 'the-crisis-game'
		const name = 'The Crisis Game'
		const about = `The Crisis Game or Kreppuspilið in Icelandic was a board game created after the Icelandic financial crisis that ${this.urlGogogic} produced. I created the jingle for the the video shorts campaign which is available <a href="https://www.youtube.com/@kreppur/videos" target="_blank">here</a>.`

		const track = new LocalTrack(
			[
				SoundData.music('crisisBegin', `${this.dirGameMusic}/Krepp_Byrjun.ogg`, 0.9),
				SoundData.music('crisisEnd', `${this.dirGameMusic}/Krepp_Endir.ogg`, 0.9)
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

					played = await end.play()
					this.instancePlayedListeners.forEach((listener) => listener(played.instance))
					await played.endedPromise
					this.instanceEndedListeners.forEach((listener) => listener(true))
				}
			}, rootUrl, name, `${this.dirGameMusic}/the-crisis-game.jpg`, about)
		return track
	}

}
