import { Injectable } from '@angular/core'
import { SoundType } from 'soundcommon/enum/soundType'
import { SoundData } from 'soundcommon/interface/soundData'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { LayeredMusicController } from 'soundcommon/layeredMusicController'
import { Artist, ITrack, LayeredMusicTrack, Track } from '../data/track'
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
				this.harmoniesOfShadeAndLight(),
				this.weWillMeetAgain(),
				this.magmaMerryGoRound(),
				this.votThemeSong(),
				this.justInTime(),
				this.icelandSocksIntro(),
				this.fortidin(),
				this.toddlerTune(),
				this.oddTimesInSpace(),
				this.lecube()
			], about: this.aboutEgillAntonsson},
			{name: 'TribeOfOranges', tracks: [
				this.introduction(),
				this.routine(),
				this.hhiCommercial()
			], about: this.aboutTribeOfOranges},
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
			{name: 'Egill & Jónas seniors', tracks: [
				this.rubber(),
				this.mouse(),
				this.chase(),
				this.guitarSolos(),
				this.withoutThem(),
				this.story(),
				this.worldIsNothing(),
				this.tapDance(),
				this.beLikeYou(),
				this.takeCare()
			], about: ''}
		]

		this.flattenTracks()

		this._isInitialized = true
	}

	private get aboutEgillAntonsson() {
		return `I started playing the piano around the age of 7.<br>
In my teenage years I added guitar (inspired by <a href="https://www.slashonline.com/">Slash</a> and others),<br>
electric bass (because all in the band can't be guitarists), and singing.<br>
Through the years I've been in various bands, projects and collaborations,<br>
and the tracks that I drove (often including collaborations with others) are published under my name.
`
	}

	private get pathToDirEgillAntonsson() {
		return Track.dir + 'egillantonsson/'
	}

	private get aboutTribeOfOranges() {
		return `A partnership with my friend <b>Sindri Bergmann Thorarinsson</b>.<br>
We coined the name when we needed to, which can be shortened to <b>TOO</b>.<br>
Me and <b>Sindri</b> have done a lot together, although not always under this name.`
	}

	private get pathToDirTribeOfOranges() {
		return Track.dir + 'too/'
	}

	private get aboutKuai() {
		return ``
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

	private rubber() {
		const track = new Track(
			'Rubber',
			[SoundData.music('rubber', `${this.pathBrothers}/Rubber.ogg`)],
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

	private mouse() {
		const track = new Track(
			'Mouse',
			[SoundData.music('mouse', `${this.pathBrothers}/Mouse.ogg`)],
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

	private chase() {
		const track = new Track(
			'The Chase',
			[SoundData.music('chase', `${this.pathBrothers}/The_Chase.ogg`)],
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

	private guitarSolos() {
		const track = new Track(
			'The Guitar Solos',
			[SoundData.music('guitarSolos', `${this.pathBrothers}/The_Guitar_Solos.ogg`)],
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

	private withoutThem() {
		const track = new Track(
			'Without Them',
			[SoundData.music('withoutThem', `${this.pathBrothers}/Without_Them.ogg`)],
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

	private story() {
		const track = new Track(
			'The Story',
			[SoundData.music('story', `${this.pathBrothers}/The_Story.ogg`)],
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

	private worldIsNothing() {
		const track = new Track(
			'The World is Nothing',
			[SoundData.music('worldIsNothing', `${this.pathBrothers}/The_World_is_Nothing.ogg`)],
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

	private tapDance() {
		const track = new Track(
			'Tap Dance',
			[SoundData.music('tapDance', `${this.pathBrothers}/Tap_Dance.ogg`)],
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

	private beLikeYou() {
		const track = new Track(
			'Be Like You',
			[SoundData.music('beLikeYou', `${this.pathBrothers}/Be_Like_You.ogg`)],
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

	private takeCare() {
		const track = new Track(
			'Take Care',
			[SoundData.music('takeCare', `${this.pathBrothers}/Take_Care.ogg`)],
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

	private votThemeSong() {
		const track = new Track(
			'Vikings of Thule Theme Song',
			[SoundData.music('votThemeSong', `${this.pathRoot}/Vikings_of_Thule__Theme_Song.ogg`)],
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

	private simpleTrack(rootName: string, artistPath: string, soundCloudUrl: string, spotifyUrl: string, buyUrl: string, about: string) {
		const track = new Track(
			rootName.split('-').join(' '),
			[SoundData.music(rootName, `${artistPath}${rootName}.ogg`)],
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
			`${artistPath}${rootName}.jpg`,
			about,
			soundCloudUrl,
			spotifyUrl,
			buyUrl
		)
		return track
	}

	private harmoniesOfShadeAndLight() {

		const rootName = 'Harmonies-of-Shade-and-Light'
		const artistPath = `${this.pathToDirEgillAntonsson}`
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/harmonies-of-shade-and-light'
		const spotifyUrl = 'https://open.spotify.com/track/1xHXUKERh3a6elM9VdPIUW?si=6055aa68ab4740f6'
		const buyUrl = 'https://www.qobuz.com/album/harmonies-of-shade-and-light-egill-antonsson/y84mz2hhlrtbc'

		const about = `I got the idea of this song when I was with the family in Thailand at the beginning of 2017.<br>
I borrowed a guitar with missing strings and created a harmony pattern and sung a melody over it.<br>
In circa 2019 I recorded the guitars and arranged the percussions from <a href="https://www.thelooploft.com/collections/drum-loops" target="_blank">The Loop Loft</a>.<br>
In the spring of 2021 my friend and music partner <b>Sindri Bergmann Thorarinsson</b><br>
helped me structure the song and write the lyrics,<br>
and he recorded my vocals in his studio in Reykjavik.<br>
In April 2022 I recorded the rest of the instruments, processed and mixed the song.
`

		return this.simpleTrack(rootName, artistPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private weWillMeetAgain() {
		const rootName = 'We-Will-Meet-Again'
		const artistPath = `${this.pathToDirEgillAntonsson}`
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/we-will-meet-again'
		const spotifyUrl = 'https://open.spotify.com/track/27t1JaFQlOX6hhkVC6d59Z?si=ea6c40e7c5c34080'
		const buyUrl = 'https://www.qobuz.com/album/we-will-meet-again-egill-antonsson/hytrd9qqfadib'

		const about = `In the spring of 2021 my friend and music partner <b>Sindri Bergmann Thorarinsson</b><br> asked me to collaborate with him to make a pop song.<br>
Although we've played some pop over the years, we have not focused on creating one per se.<br>
So our goal now was to focus on the 'formula of what makes a good (modern) pop song',<br>
and also speed up our workflow to complete the song in couple of days (from start to finish).<br>
We created the song and lyrics together, I sang in the lyrics and <b>Sindri</b> mixed, processed and polished the whole song.<br>
We put the song under artist Egill Antonsson (for convenience) although it's truly a collaboration.
`

		return this.simpleTrack(rootName, artistPath, soundCloudUrl, spotifyUrl, buyUrl, about)
	}

	private magmaMerryGoRound() {
		const rootName = 'Magma-MerryGoRound'
		const artistPath = `${this.pathToDirEgillAntonsson}`
		const soundCloudUrl = 'https://soundcloud.com/egill-antonsson/magma-merrygoround'
		const spotifyUrl = 'https://open.spotify.com/track/06bQmD7bI6N1qGDeIVsGYR?si=418ee63136664f30'
		const buyUrl = 'https://www.qobuz.com/album/magma-merrygoround-egill-antonsson/bqp8z0xr9lqja'

		const about = `Released at the <a href="https://edisonparty.com">Edison demo-party</a> in 2021 under my new handle/pseudonym <b>Vulkanoman</b>.<br>
My original title for the tune was 'Tivoli Chase Cop 27/16' but I renamed<br>
as I got more and more inspired by my recent trip to the then ongoing volcano eruption in <a href="https://en.wikipedia.org/wiki/Fagradalsfjall">Fagradallsfjall in Iceland</a>

`

		return this.simpleTrack(rootName, artistPath, soundCloudUrl, spotifyUrl, buyUrl, about)
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
		const track = new Track(
			'Iceland Socks: Intro',
			[SoundData.music('icelandSocksIntro', `${this.pathRoot}/Iceland_Socks__Intro.ogg`)],
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
		const rootName = 'Introduction'
		const track = new Track(rootName,
			[SoundData.music(rootName, `${this.pathToDirTribeOfOranges}${rootName}.aac`)],
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
			`${this.pathToDirTribeOfOranges}${rootName}.jpg`,
			this.aboutIntroduction)
		return track
	}

	private get aboutIntroduction() {
		return `<b>Sindri Bergmann Thorarinsson</b> and me made this for a theatre play,<br>
and it was played at the start of it, and thus it's named <b>Introduction</b>.<br>
For the artwork I chose the 'the indian head', which is a valuable family artifact.
`
	}

	private routine() {
		const track = new Track(
			'Routine',
			[SoundData.music('routine', `${this.pathRoot}/Routine.ogg`)],
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

	private hhiCommercial() {
		const track = new Track(
			'Song for HHI commercial',
			[SoundData.music('hhiCommercial', `${this.pathRoot}/Song_for_HHI_commercial.ogg`)],
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
