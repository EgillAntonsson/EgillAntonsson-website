import { Injectable } from '@angular/core'
import { SoundManagerService } from './soundManager.service'
import { ITrack, LayeredMusicTrack, Track} from 'app/shared/data/track'
import { SoundType } from 'soundcommon/enum/soundType'
import { LayeredMusicController } from 'soundcommon/layeredMusicController'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { BooleanEmitter } from '../../../soundcommon/emitter/booleanEmitter'
import { WindowRefService } from './windowRef.service'
import { LogService } from './log.service'
import { LogType } from 'shared/enums/logType'
import { RandomNumber } from './randomNumber.service'

interface PlayReturn {
	instance: SoundInstance
	endedPromise: Promise<SoundInstance>
}

interface ByTracks {
	by: string
	tracks: ITrack[]
	byBio?: string
}

@Injectable({
	providedIn: 'root',
})
export class MusicService {
	readonly label = 'MusicService'
	private _selectedTrack: ITrack
	get selectedTrack() {
		return this._selectedTrack
	}

	nextSelectedTrack: ITrack
	private _byTracksArr!: ByTracks[]
	get byTracksArr() {
		return this._byTracksArr
	}
	private _awaitingFirstPlay = false

	get awaitingFirstPlay() {
		return this._awaitingFirstPlay
	}

	private _isPlaying = false
	get isPlaying() {
		return this._isPlaying
	}
	private timeout: NodeJS.Timeout | undefined
	readonly pathRoot = '../../assets/audio'
	readonly pathGame = `${this.pathRoot}/game`
	readonly pathKuai = `${this.pathRoot}/kuai`
	readonly pathBrothers = `${this.pathRoot}/braedraminning`
	readonly instancePlayedListeners: Map<string, (soundInstance: SoundInstance) => void>
	readonly instanceEndedListeners: Map<string, (trackEnded?: boolean, serviceDidStop?: boolean) => void>
	private tracks: ITrack[]
	private _isShuffle = true
	get isShuffle() {
		return this._isShuffle
	}

	constructor(private soundManager: SoundManagerService, private windowRef: WindowRefService, private logService: LogService, private randomNumber: RandomNumber) {
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()
		soundManager.instance.init(this.windowRef.nativeWindow, logService.log)

		this.tracks = []
		this.setupTracks()
		this.flattenTracksToList()

		if (this._isShuffle) {
			randomNumber.startUniqueNumberTracking(this.tracks.length)
			this.nextSelectedTrack = this.tracks[randomNumber.generateUniqueRandomNumber()]
		} else {
			this.nextSelectedTrack = this.tracks[0]
		}

		this._selectedTrack = this.nextSelectedTrack

		this.addInstanceEndedListener(`${this.label} endedListener`, (trackEnded?: boolean) => {
			if (this.timeout) {
					clearTimeout(this.timeout)
					this.timeout = undefined
			}
			if (trackEnded) {
				this._isPlaying = false
			}
		})
	}

	toggleShuffle() {
		this._isShuffle = !this._isShuffle
		if (this._isShuffle) {
			this.randomNumber.startUniqueNumberTracking(this.tracks.length)
		}
	}

	flattenTracksToList() {
		let index = 0

		for (let i = 0; i < this._byTracksArr.length; i++) {
			for (let j = 0; j < this._byTracksArr[i].tracks.length; j++) {
				const track = this._byTracksArr[i].tracks[j]
				track.index = index++
				this.tracks.push(track)
			}
		}
	}

	play(gainsDisabled: BooleanEmitter) {
		if (this._awaitingFirstPlay) {
			return
		}
		this.stop()

		const track = this.nextSelectedTrack
		if (!this.soundManager.instance.hasSound(track.soundDatas[0].key)) {
			for (let i = 0; i < track.soundDatas.length; i++) {
				this.soundManager.instance.addSound(track.soundDatas[i])
				this.logService.log(LogType.Info, `[${this.label}]`, 'adding sounds')
			}
		}
		this._awaitingFirstPlay = true
		track.play()()
		this._isPlaying = true

		if (track instanceof LayeredMusicTrack) {
			track.layeredMusicController.gainsDisabled = gainsDisabled
		}

		this._selectedTrack = track
	}

	stop() {
		this.soundManager.instance.stopMusic()
		const track = this._selectedTrack
		if (track instanceof LayeredMusicTrack && track.layeredMusicController) {
			track.layeredMusicController.stop()
		}
		this.instanceEndedListeners.forEach((listener) => listener(true, true))
		this._isPlaying = false
	}

	nextTrack() {
		let nextIndex: number
		if (this._isShuffle) {
			nextIndex = this.randomNumber.generateUniqueRandomNumber()
		} else {
			nextIndex = this._selectedTrack.index + 1
		}

		this.logService.log(LogType.Info, 'nextIndex', nextIndex)

		this.nextSelectedTrack = this.tracks[nextIndex]

	}

	addInstancePlayedListener(name: string, listener: (soundInstance: SoundInstance) => void) {
		this.instancePlayedListeners.set(name, listener)
	}

	addInstanceEndedListener(name: string, listener: (trackEnded?: boolean, serviceDidStop?: boolean) => void) {
		this.instanceEndedListeners.set(name, listener)
	}

	removeInstancePlayedListener(name: string) {
		this.instancePlayedListeners.delete(name)
	}

	removeInstanceEndedListener(name: string) {
		this.instanceEndedListeners.delete(name)
	}

	private setupTracks() {

const justInTime = new Track('Just in Time', [
{url: `${this.pathRoot}/Just_in_Time.ogg`, key: 'justInTime', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
	const sound = this.soundManager.instance.getSound(justInTime.soundDatas[0].key)
	let nrOfLoops = 2
	do {
		const {instance, endedPromise} = await sound.play()
		this.instancePlayedListeners.forEach((listener) => listener(instance))
		this._awaitingFirstPlay = false
		await endedPromise
		this.instanceEndedListeners.forEach((listener) => listener(nrOfLoops === 1))
		nrOfLoops--
	} while (nrOfLoops > 0)
}
})

const rubber = new Track('Rubber', [
{url: `${this.pathBrothers}/Rubber.ogg`, key: 'rubber', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(rubber.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const mouse = new Track('Mouse', [
{url: `${this.pathBrothers}/Mouse.ogg`, key: 'mouse', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(mouse.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const chase = new Track('The Chase', [
{url: `${this.pathBrothers}/The_Chase.ogg`, key: 'chase', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(chase.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const guitarSolos = new Track('The Guitar Solos', [
{url: `${this.pathBrothers}/The_Guitar_Solos.ogg`, key: 'guitarSolos', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(guitarSolos.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const withoutThem = new Track('Without Them', [
{url: `${this.pathBrothers}/Without_Them.ogg`, key: 'withoutThem', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(withoutThem.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const story = new Track('The Story', [
{url: `${this.pathBrothers}/The_Story.ogg`, key: 'story', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(story.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const worldIsNothing = new Track('The World is Nothing', [
{url: `${this.pathBrothers}/The_World_is_Nothing.ogg`, key: 'worldIsNothing', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(worldIsNothing.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const beLikeYou = new Track('Be Like You', [
{url: `${this.pathBrothers}/Be_Like_You.ogg`, key: 'beLikeYou', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(beLikeYou.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const takeCare = new Track('Take Care', [
{url: `${this.pathBrothers}/Take_Care.ogg`, key: 'takeCare', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(takeCare.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const tapDance = new Track('Tap Dance', [
{url: `${this.pathBrothers}/Tap_Dance.ogg`, key: 'tapDance', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(tapDance.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const hhiComm = new Track('Song for HHI commercial', [
{url: `${this.pathRoot}/Song_for_HHI_commercial.ogg`, key: 'hhiComm', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(hhiComm.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const routine = new Track('Routine', [
{url: `${this.pathRoot}/Routine.ogg`, key: 'routine', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(routine.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const intro = new Track('Introduction', [
{url: `${this.pathRoot}/Introduction.aac`, key: 'intro', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(intro.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const lecube = new Track('Lecube', [
{url: `${this.pathRoot}/Lecube.ogg`, key: 'lecube', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(lecube.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const otis = new Track('Odd Times in Space', [
{url: `${this.pathRoot}/Odd_Times_in_Space.ogg`, key: 'otis', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(otis.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const toddlerTune = new Track('Toddler Tune', [
{url: `${this.pathRoot}/Toddler_Tune.ogg`, key: 'toddlerTune', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(toddlerTune.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const fortidin = new Track('Fortíðin', [
{url: `${this.pathRoot}/Fortidin.ogg`, key: 'fortidin', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(fortidin.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const icelandSocksIntro = new Track('Iceland Socks: Intro', [
{url: `${this.pathRoot}/Iceland_Socks__Intro.ogg`, key: 'icelandSocksIntro', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(icelandSocksIntro.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const votThemeSong = new Track('Vikings of Thule: Theme', [
{url: `${this.pathRoot}/Vikings_of_Thule__Theme_Song.ogg`, key: 'votThemeSong', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(votThemeSong.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const Pirringur = new Track('Pirringur', [
{url: `${this.pathKuai}/Pirringur.ogg`, key: 'Pirringur', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(Pirringur.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const Apollo = new Track('Apollo', [
{url: `${this.pathKuai}/Apollo.ogg`, key: 'Apollo', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(Apollo.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const Andsetinn = new Track('Andsetinn', [
{url: `${this.pathKuai}/Andsetinn.ogg`, key: 'Andsetinn', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(Andsetinn.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const Hamskipti = new Track('Hamskipti', [
{url: `${this.pathKuai}/Hamskipti.ogg`, key: 'Hamskipti', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(Hamskipti.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const Rover = new Track('Rover', [
{url: `${this.pathKuai}/Rover.ogg`, key: 'Rover', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(Rover.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})


const Andefni = new Track('Andefni', [
{url: `${this.pathKuai}/Andefni.ogg`, key: 'Andefni', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(Andefni.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const Agndofa = new Track('Agndofa', [
{url: `${this.pathKuai}/Agndofa.ogg`, key: 'Agndofa', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(Agndofa.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const Ofurte = new Track('Ofurte', [
{url: `${this.pathKuai}/Ofurte.ogg`, key: 'Ofurte', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(Ofurte.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const LesblindaI = new Track('Lesblinda I', [
{url: `${this.pathKuai}/Lesblinda_I.ogg`, key: 'LesblindaI', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(LesblindaI.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

const LesblindaII = new Track('Lesblinda II', [
{url: `${this.pathKuai}/Lesblinda_II.ogg`, key: 'LesblindaII', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
return async () => {
const sound = this.soundManager.instance.getSound(LesblindaII.soundDatas[0].key)
const {instance, endedPromise} = await sound.play()
this.instancePlayedListeners.forEach((listener) => listener(instance))
this._awaitingFirstPlay = false
await endedPromise
this.instanceEndedListeners.forEach((listener) => listener(true))
}
})

		const godsruleLayered = new LayeredMusicTrack('Godsrule: Village', [
{url: `${this.pathGame}/loton_MusicVillageEnvironmentLayer.ogg`, key: 'godsruleEnvironmentLayer', soundType: SoundType.Music, maxGain: 0.075, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/loton_MusicVillageStringLayer.ogg`, key: 'godsruleStringLayer', soundType: SoundType.Music, maxGain: 0.55, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/loton_MusicVillageHarpLayer.ogg`, key: 'godsruleHarpLayer', soundType: SoundType.Music, maxGain: 0.4, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/loton_MusicVillagePianoLayer.ogg`, key: 'godsrulePianoLayer', soundType: SoundType.Music, maxGain: 0.35, loop: true, maxNrPlayingAtOnce: 1}
],
() => {

	return async () => {
		const sounds = [
			this.soundManager.instance.getSound(godsruleLayered.soundDatas[0].key),
			this.soundManager.instance.getSound(godsruleLayered.soundDatas[1].key),
			this.soundManager.instance.getSound(godsruleLayered.soundDatas[2].key),
			this.soundManager.instance.getSound(godsruleLayered.soundDatas[3].key)
		]
		const instances: SoundInstance[] = []
		for (let i = 0; i < sounds.length; i++) {
			const sound = sounds[i]
			const {instance} = await sound.play()
			instances.push(instance)
			this.instancePlayedListeners.forEach((listener) => listener(instance))
		}
		godsruleLayered.layeredMusicController.start(instances)
		this._awaitingFirstPlay = false
	}
},
new LayeredMusicController(this.instanceEndedListeners, this.logService.log))

	const votLayered = new LayeredMusicTrack('Vikings of Thule: Map', [
{url: `${this.pathGame}/VOT_InterfaceMusic_0.mp3`, key: 'votWindLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/VOT_InterfaceMusic_3.ogg`, key: 'votChoirLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/VOT_InterfaceMusic_2.ogg`, key: 'votHarpLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/VOT_InterfaceMusic_1.ogg`, key: 'votMelodyLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1}
],
() => {

	return async () => {
		const sounds = [
			this.soundManager.instance.getSound(votLayered.soundDatas[0].key),
			this.soundManager.instance.getSound(votLayered.soundDatas[1].key),
			this.soundManager.instance.getSound(votLayered.soundDatas[2].key),
			this.soundManager.instance.getSound(votLayered.soundDatas[3].key)
		]
		const instances: SoundInstance[] = []
		for (let i = 0; i < sounds.length; i++) {
			const sound = sounds[i]
			const {instance} = await sound.play()
			instances.push(instance)
			this.instancePlayedListeners.forEach((listener) => listener(instance))
		}
		votLayered.layeredMusicController.start(instances)
		this._awaitingFirstPlay = false
	}
},
new LayeredMusicController(this.instanceEndedListeners, this.logService.log))

		const cpp = new Track('Cake Pop Party', [
{url: `${this.pathGame}/CPP_workMusicIntroScreen.ogg`, key: 'cppMusicIntro', soundType: SoundType.Music, maxGain: 0.7, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/CPP_musicTransitionBeatFade.ogg`, key: 'cppMusicScaleBeat', soundType: SoundType.Music, maxGain: 0.6, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/CPP_workMusicMakePopLoop.ogg`, key: 'cppMusicMakePop', soundType: SoundType.Music, maxGain: 0.7, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const cppIntro = this.soundManager.instance.getSound(cpp.soundDatas[0].key)
		const scaleBeat = this.soundManager.instance.getSound(cpp.soundDatas[1].key)
		const makePop = this.soundManager.instance.getSound(cpp.soundDatas[2].key)

		let playReturn: PlayReturn
		let nrOfLoop = 2
		do {
			playReturn = await cppIntro.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await cppIntro.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await scaleBeat.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await makePop.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener(nrOfLoop === 1))

			nrOfLoop--
		} while (nrOfLoop > 0)
	}
})

		const symbol6 = new Track('Symbol 6', [
{url: `${this.pathGame}/SSIX_menu.ogg`, key: 'ssixMenu', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/SSIX_game.ogg`, key: 'ssixGame', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/SSIX_HexagoTune.ogg`, key: 'ssixHexago', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const menu = this.soundManager.instance.getSound(symbol6.soundDatas[0].key)
		const game = this.soundManager.instance.getSound(symbol6.soundDatas[1].key)
		const hexago = this.soundManager.instance.getSound(symbol6.soundDatas[2].key)

		let playReturn: PlayReturn
		let nrOfLoop = 2
		do {
			playReturn = await menu.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await game.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await hexago.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener(nrOfLoop === 1))

		nrOfLoop--
		} while (nrOfLoop > 0)
	}
})

		const habitarium = new Track('Habitarium', [
{url: `${this.pathGame}/Habitarium_main_theme.ogg`, key: 'habitariumMainTheme', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/Habitarium_InGameLoop.ogg`, key: 'habitariumInGameLoop', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const main = this.soundManager.instance.getSound(habitarium.soundDatas[0].key)
		const inGame = this.soundManager.instance.getSound(habitarium.soundDatas[1].key)

		let playReturn: PlayReturn
		let nrOfLoop = 2
		do {
			playReturn = await main.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await inGame.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener(nrOfLoop === 1))

		nrOfLoop--
		} while (nrOfLoop > 0)
	}
})

		const tp = new Track('Tiny Places', [
{url: `${this.pathGame}/TP_mainThemeIntro.ogg`, key: 'tpMainThemeIntro', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/TP_mainThemeBridge.ogg`, key: 'tpMainThemeBridge', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/TP_spaceWorld.ogg`, key: 'tpSpaceWorld', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/TP_tomb.ogg`, key: 'tpTomb', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/TP_lazyStyle.ogg`, key: 'tpLazyStyle', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/TP_cutScene.ogg`, key: 'tpCutScene', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/TP_inGame.ogg`, key: 'tpInGame', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/TP_outoftime.ogg`, key: 'tpOutOfTime', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const intro = this.soundManager.instance.getSound(tp.soundDatas[0].key)
		const bridge = this.soundManager.instance.getSound(tp.soundDatas[1].key)
		const space = this.soundManager.instance.getSound(tp.soundDatas[2].key)
		const tomb = this.soundManager.instance.getSound(tp.soundDatas[3].key)
		const lazy = this.soundManager.instance.getSound(tp.soundDatas[4].key)
		const cut = this.soundManager.instance.getSound(tp.soundDatas[5].key)
		const inGame = this.soundManager.instance.getSound(tp.soundDatas[6].key)
		const time = this.soundManager.instance.getSound(tp.soundDatas[7].key)

		let playReturn: PlayReturn
		playReturn = await intro.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false

		const curTime = intro.audioCtx.currentTime
		playReturn.instance.gainWrapper.setValueAtTime(0.4, curTime).exponentialRampToValueAtTime(0.8, curTime + 0.3)

		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await bridge.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await space.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await space.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await tomb.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await tomb.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await lazy.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await lazy.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await cut.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await inGame.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await time.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener(true))

	}
})

		const wyf = new Track('Who\'s Your Friend', [
{url: `${this.pathGame}/WYF_ThemeSong.ogg`, key: 'wyf', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const sound = this.soundManager.instance.getSound(wyf.soundDatas[0].key)
		const {instance, endedPromise} = await sound.play()
		this.instancePlayedListeners.forEach((listener) => listener(instance))
		this._awaitingFirstPlay = false
		await endedPromise
		this.instanceEndedListeners.forEach((listener) => listener(true))
	}
})

		const kyf = new Track('Know Your Friend', [
{url: `${this.pathGame}/KYF_IntroMusic_WithAudience.ogg`, key: 'kyfIntroMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/KYF_90secondsMusic.ogg`, key: 'kyf90secMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const intro = this.soundManager.instance.getSound(kyf.soundDatas[0].key)
		const seconds = this.soundManager.instance.getSound(kyf.soundDatas[1].key)

		let playReturn: PlayReturn
		playReturn = await seconds.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await intro.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await intro.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await seconds.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener(true))
	}
})

		const stackem = new Track('Stack\'em', [
{url: `${this.pathGame}/Stackem_Tune_loop.ogg`, key: 'stackem', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const sound = this.soundManager.instance.getSound(stackem.soundDatas[0].key)

		let nrOfLoops = 2
		do {
			const {instance, endedPromise} = await sound.play()
			this.instancePlayedListeners.forEach((listener) => listener(instance))
			this._awaitingFirstPlay = false
			await endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())
			nrOfLoops--
		} while (nrOfLoops > 0)
	}
})

		const crisis = new Track('The Crisis Game', [
{url: `${this.pathGame}/Krepp_Byrjun.ogg`, key: 'crisisBegin', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/Krepp_Endir.ogg`, key: 'crisisEnd', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const begin = this.soundManager.instance.getSound(crisis.soundDatas[0].key)
		const end = this.soundManager.instance.getSound(crisis.soundDatas[1].key)

		let playReturn: PlayReturn
		playReturn = await begin.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await begin.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await end.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())
	}
})

		const glow = new Track('Glowbulleville', [
{url: `${this.pathGame}/GLOB_main_music.mp3`, key: 'glowMainMusic', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/GLOB_village_music.mp3`, key: 'glowVillageMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/GLOB_wack_a_mole.mp3`, key: 'glowWack', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const main = this.soundManager.instance.getSound(glow.soundDatas[0].key)
		const village = this.soundManager.instance.getSound(glow.soundDatas[1].key)
		const wack = this.soundManager.instance.getSound(glow.soundDatas[2].key)

		let playReturn: PlayReturn
		let nrOfLoops = 2
		do {
			playReturn = await main.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await main.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await village.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await village.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await wack.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener(nrOfLoops === 1))

			nrOfLoops--
		} while (nrOfLoops > 0)
	}
})

		const godsrule = new Track('Godsrule: Battle', [
{url: `${this.pathGame}/LOTON_BattleBaseLayer.ogg`, key: 'godsruleBattle', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/LOTON_CombatDefeatMusic.ogg`, key: 'godsruleDefeat', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/LOTON_CombatVictory.ogg`, key: 'godsruleVictory', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const battle = this.soundManager.instance.getSound(godsrule.soundDatas[0].key)
		const defeat = this.soundManager.instance.getSound(godsrule.soundDatas[1].key)
		const victory = this.soundManager.instance.getSound(godsrule.soundDatas[2].key)

		let playReturn: PlayReturn
		let nrOfLoops = 2
		do {
			playReturn = await battle.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await defeat.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await victory.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
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

const vot = new Track('Vikings of Thule: Feud', [
{url: `${this.pathGame}/VOT_FeudMusic_drums.ogg`, key: 'votFeudDrums', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/VOT_FeudMusic.ogg`, key: 'votFeud', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/VOT_FeudEnding.ogg`, key: 'votFeudEnding', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const feudDrums = this.soundManager.instance.getSound(vot.soundDatas[0].key)
		const feud = this.soundManager.instance.getSound(vot.soundDatas[1].key)
		const feudEnding = this.soundManager.instance.getSound(vot.soundDatas[2].key)

		let playReturn: PlayReturn
		playReturn = await feudDrums.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await feud.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await feud.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))

		const curTime = feud.audioCtx.currentTime
		const duration = playReturn.instance.sourceNode.buffer?.duration || 10
		playReturn.instance.gainWrapper.setTargetAtTime(0, curTime + duration - 0.799, 1)

		const asyncTimeout = async () => {
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await feudEnding.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener(true))
		}

		this.timeout = setTimeout(() => {
			asyncTimeout()
		}, ((playReturn.instance.sourceNode.buffer?.duration || 10) * 1000) - 799)
	}
})

		const jol2008 = new Track('Christmas Game 2008', [
{url: `${this.pathGame}/jolagogo2008_main_music.ogg`, key: 'jol2008mainMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/jolagogo2008_game_over.ogg`, key: 'jol2008gameOver', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const main = this.soundManager.instance.getSound(jol2008.soundDatas[0].key)
		const gameOver = this.soundManager.instance.getSound(jol2008.soundDatas[1].key)

		let playReturn: PlayReturn
		playReturn = await main.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await main.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		playReturn = await gameOver.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener(true))
	}
})

		const jol2009 = new Track('Christmas Game 2009', [
{url: `${this.pathGame}/jolagogo2009_Bridge.ogg`, key: 'jol2009bridge', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/jolagogo2009_Chorus.ogg`, key: 'jol2009chorus', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
	],
	() => {
		return async () => {
			const bridge = this.soundManager.instance.getSound(jol2009.soundDatas[0].key)
			const chorus = this.soundManager.instance.getSound(jol2009.soundDatas[1].key)

			let playReturn: PlayReturn
			let nrOfLoops = 2
			do {
				playReturn = await bridge.play()
				this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
				this._awaitingFirstPlay = false

				if (nrOfLoops === 2) {
					const curTime = bridge.audioCtx.currentTime
					playReturn.instance.gainWrapper.setValueAtTime(0.1, curTime).exponentialRampToValueAtTime(1, curTime + 0.25)
				}

				await playReturn.endedPromise
				this.instanceEndedListeners.forEach((listener) => listener())

				playReturn = await chorus.play()
				this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
				this._awaitingFirstPlay = false
				await playReturn.endedPromise
				this.instanceEndedListeners.forEach((listener) => listener(nrOfLoops === 1))

				nrOfLoops--
			} while (nrOfLoops > 0)
		}
	})

		const sff = new Track('Soft Freak Fiesta', [
{url: `${this.pathGame}/SFF_IntroMenuMusic.ogg`, key: 'sffIntroMenuMusic', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/SFF_MenuMusic.ogg`, key: 'sffMenuMusic', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/SFF_LevelMusic_noEnv.ogg`, key: 'sffLevelMusicNoEnv', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/SFF_LevelMusic_bubbling.ogg`, key: 'sffLevelMusicBubbling', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/SFF_LoseJingle.ogg`, key: 'sffLoseJingle', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathGame}/SFF_WinJingle.ogg`, key: 'sffWinJingle', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const introMenu = this.soundManager.instance.getSound(sff.soundDatas[0].key)
		const mainMenu = this.soundManager.instance.getSound(sff.soundDatas[1].key)
		const levelNoEnv = this.soundManager.instance.getSound(sff.soundDatas[2].key)
		const levelBubbling = this.soundManager.instance.getSound(sff.soundDatas[3].key)
		const loseJingle = this.soundManager.instance.getSound(sff.soundDatas[4].key)
		const winJingle = this.soundManager.instance.getSound(sff.soundDatas[5].key)
		let playLose = true

		let playReturn: PlayReturn
		playReturn = await introMenu.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
		this._awaitingFirstPlay = false
		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		let nrOfLoop = 2
		do {
			playReturn = await mainMenu.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await levelNoEnv.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await levelBubbling.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			if (playLose) {
				playReturn = await loseJingle.play()
			} else {
				playReturn = await winJingle.play()
			}
			playLose = !playLose
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener(nrOfLoop === 1))

			--nrOfLoop
		} while (nrOfLoop > 0)
	}
})

		this._byTracksArr = [
			{by: 'Egill & Jónas seniors', tracks: [
				rubber,
				mouse,
				chase,
				guitarSolos,
				withoutThem,
				story,
				worldIsNothing,
				tapDance,
				beLikeYou,
				takeCare
			]},
			{by: 'Egill Antonsson', tracks: [
				justInTime,
				votThemeSong,
				icelandSocksIntro,
				fortidin,
				toddlerTune,
				otis,
				lecube
			]},
			{by: 'TribeOfOranges', tracks: [
				intro,
				routine,
				hhiComm
			]},
			{by: 'KUAI', tracks: [
				Pirringur,
				Apollo,
				Andsetinn,
				Hamskipti,
				Rover,
				Andefni,
				Agndofa,
				Ofurte,
				LesblindaI,
				LesblindaII
			]},
			{by: 'Game Music - Layered', tracks: [
				godsruleLayered,
				votLayered
			]},
			{by: 'Game Music', tracks: [
				cpp,
				symbol6,
				sff,
				habitarium,
				tp,
				jol2008,
				jol2009,
				wyf,
				kyf,
				stackem,
				glow,
				godsrule,
				vot,
				crisis
			]}
		]
	}

}
