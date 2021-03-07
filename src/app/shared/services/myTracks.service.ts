import { Injectable } from '@angular/core'
import { SoundType } from 'soundcommon/enum/soundType'
import { SoundData } from 'soundcommon/interface/soundData'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { LayeredMusicController } from 'soundcommon/layeredMusicController'
import { LayeredMusicTrack, Track } from '../data/track'
import { LogService } from './log.service'
import { SoundManagerService } from './soundManager.service'

export interface ByTracks {
	by: string
	tracks: Track[]
	byBio?: string
}

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

	private _byTracks!: ByTracks[]
	get byTracks() {
		return this._byTracks
	}

	private _flatTracks!: Track[]
	get flatTracks() {
		return this._flatTracks
	}

	readonly instancePlayedListeners!: Map<string, (soundInstance: SoundInstance) => void>
	readonly instanceEndedListeners!: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>
	private _timeout: NodeJS.Timeout | undefined
	public get timeout() {
		return this._timeout
	}
	public set timeout(value: NodeJS.Timeout | undefined) {
		this._timeout = value
	}

	constructor(private soundManager: SoundManagerService, private logService: LogService) {
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
	}

	init() {
		if (this._isInitialized) {
			return
		}

		this._byTracks = [
			{by: 'Egill Antonsson', tracks: [
				this.justInTime(),
				this.votThemeSong(),
				this.icelandSocksIntro(),
				this.fortidin(),
				this.toddlerTune(),
				this.oddTimesInSpace(),
				this.lecube()
			]},
			{by: 'TribeOfOranges', tracks: [
				this.intro(),
				this.routine(),
				this.hhiCommercial()
			]},
			{by: 'KUAI', tracks: [
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
			]},
			{by: 'Game Music - Layered', tracks: [
				this.godsruleLayered(),
				this.votLayered()
			]},
			{by: 'Game Music', tracks: [
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
			]},
			{by: 'Egill & Jónas seniors', tracks: [
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
			]}
		]

		this.flattenTracks()

		this._isInitialized = true
	}

	private flattenTracks() {
		this._flatTracks = []
		let index = 0
		for (let i = 0; i < this._byTracks.length; i++) {
			for (let j = 0; j < this._byTracks[i].tracks.length; j++) {
				const track = this._byTracks[i].tracks[j]
				track.index = index++
				this._flatTracks.push(track)
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

	private votThemeSong() {
		const track = new Track(
			'Vikings of Thule: Theme',
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
			[SoundData.music('lecude', `${this.pathRoot}/Lecube.ogg`)],
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

	private intro() {
		const track = new Track(
			'Introduction',
			[SoundData.music('intro', `${this.pathRoot}/Introduction.aac`)],
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
		const track = new Track(
			'Pirringur',
			[SoundData.music('pirringur', `${this.pathKuai}/Pirringur.ogg`)],
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

	private apollo() {
		const track = new Track(
			'Apollo',
			[SoundData.music('apollo', `${this.pathKuai}/Apollo.ogg`)],
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

	private andsetinn() {
		const track = new Track(
			'Andsetinn',
			[SoundData.music('andsetinn', `${this.pathKuai}/Andsetinn.ogg`)],
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

	private hamskipti() {
		const track = new Track(
			'Hamskipti',
			[SoundData.music('hamskipti', `${this.pathKuai}/Hamskipti.ogg`)],
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

	private rover() {
		const track = new Track(
			'Rover',
			[SoundData.music('rover', `${this.pathKuai}/Rover.ogg`)],
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

	private andefni() {
		const track = new Track(
			'Andefni',
			[SoundData.music('andefni', `${this.pathKuai}/Andefni.ogg`)],
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

	private agndofa() {
		const track = new Track(
			'Agndofa',
			[SoundData.music('agndofa', `${this.pathKuai}/Agndofa.ogg`)],
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

	private ofurte() {
		const track = new Track(
			'Ofurte',
			[SoundData.music('ofurte', `${this.pathKuai}/Ofurte.ogg`)],
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

	private lesblindaI() {
		const track = new Track(
			'Lesblinda I',
			[SoundData.music('lesblindaI', `${this.pathKuai}/Lesblinda_I.ogg`)],
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

	private lesblindaII() {
		const track = new Track(
			'Lesblinda II',
			[SoundData.music('lesblindaII', `${this.pathKuai}/Lesblinda_II.ogg`)],
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
