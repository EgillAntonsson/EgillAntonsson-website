import { Injectable } from '@angular/core'
import { SoundManagerService } from './soundManager.service'
import { Track as ITrack } from 'app/shared/data/track'
import { SoundType } from 'soundcommon/enum/soundType'
import { LayeredMusicController } from 'soundcommon/layeredMusicController'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { BooleanEmitter } from '../../soundcommon/emitter/booleanEmitter'
import { LogType } from 'app/shared/Log';

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

	emptyTrack: ITrack
	private _selectedTrack: ITrack
	get selectedTrack() {
		return this._selectedTrack
	}
	private log: (message?: any, ...optionalParams: any[]) => void
	private _byTracksArr: ByTracks[]
	get byTracksArr() {
		return this._byTracksArr
	}
	private _awaitingFirstPlay = false

	get awaitingFirstPlay() {
		return this._awaitingFirstPlay
	}

	readonly pathMusic = '../../assets/audio/game'
	readonly instancePlayedListeners: Map<string, (soundInstance: SoundInstance) => void>
	readonly instanceEndedListeners: Map<string, () => void>

	constructor(private soundManager: SoundManagerService) {
			this.emptyTrack = new ITrack('select a track',  [{key: 'key', url: 'url', soundType: SoundType.Music, maxGain: 1, loop: false}], null)

		this._selectedTrack = this.emptyTrack
		this.instancePlayedListeners = new Map()
		this.instanceEndedListeners = new Map()

		this.setupTracks()

	}

	setLog(log: (logType: LogType, message?: any, ...optionalParams: any[]) => void) {
		this.log =  (logType: LogType, message?: any, ...optionalParams: any[]) => {
			if (log) {
				log(logType, message, optionalParams)
			}
		}
	}

	play(track: ITrack, gainsDisabled: BooleanEmitter) {
		if (!this.soundManager.instance.hasSound(track.soundDatas[0].key)) {
			for (let i = 0; i < track.soundDatas.length; i++) {
				this.soundManager.instance.addSound(track.soundDatas[i])
				this.log(LogType.Info, `[${this.label}]`, 'adding sounds')
			}
		}

		console.log('before play')
		this._awaitingFirstPlay = true
		track.play(track)()

		if (track.layeredMusicController) {
			track.layeredMusicController.gainsDisabled = gainsDisabled
		}

		this._selectedTrack = track
	}

	stop() {
		this.soundManager.instance.stopMusic()

		if (this._selectedTrack.layeredMusicController) {
			this._selectedTrack.layeredMusicController.stop()
		}

		this._selectedTrack = this.emptyTrack
	}

	addInstancePlayedListener(name: string, listener: (soundInstance: SoundInstance) => void) {
		this.instancePlayedListeners.set(name, listener)
	}

	addInstanceEndedListener(name: string, listener: () => void) {
		this.instanceEndedListeners.set(name, listener)
	}

	removeInstancePlayedListener(name: string) {
		this.instancePlayedListeners.delete(name)
	}

	removeInstanceEndedListener(name: string) {
		this.instanceEndedListeners.delete(name)
	}

	private setupTracks() {

		const godsruleLayered = {name: 'Godsrule: Village', soundDatas: [
{url: `${this.pathMusic}/loton_MusicVillageEnvironmentLayer.ogg`, key: 'godsruleEnvironmentLayer', soundType: SoundType.Music, maxGain: 0.075, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/loton_MusicVillageStringLayer.ogg`, key: 'godsruleStringLayer', soundType: SoundType.Music, maxGain: 0.55, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/loton_MusicVillageHarpLayer.ogg`, key: 'godsruleHarpLayer', soundType: SoundType.Music, maxGain: 0.4, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/loton_MusicVillagePianoLayer.ogg`, key: 'godsrulePianoLayer', soundType: SoundType.Music, maxGain: 0.35, loop: true, maxNrPlayingAtOnce: 1}
],
play: (track: ITrack) => {
	if (!track.layeredMusicController) {
		const sounds = [
			this.soundManager.instance.getSound(track.soundDatas[0].key),
			this.soundManager.instance.getSound(track.soundDatas[1].key),
			this.soundManager.instance.getSound(track.soundDatas[2].key),
			this.soundManager.instance.getSound(track.soundDatas[3].key)
		]
		track.layeredMusicController = new LayeredMusicController(sounds, 3, this.log)
	}

	return async () => {
		const instances: SoundInstance[] = []
		for (let i = 0; i < track.layeredMusicController.layerSounds.length; i++) {
			const sound = track.layeredMusicController.layerSounds[i]
			console.log('before sound.play')
			const {instance} = await sound.play()
			console.log('after sound.play')
			instances.push(instance)
			this.instancePlayedListeners.forEach((listener) => listener(instance))
		}

		console.log('after await loop')
		track.layeredMusicController.start(instances)



		this._awaitingFirstPlay = false
	}
}}

		const wyf = new ITrack('Who\'s Your Friend', [
{url: `${this.pathMusic}/WYF_ThemeSong.ogg`, key: 'wyf', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
],
(track: ITrack) => {
	return async () => {
		const sound = this.soundManager.instance.getSound(track.soundDatas[0].key)
		const {instance} = await sound.play()
		this.instancePlayedListeners.forEach((listener) => listener(instance))

		this._awaitingFirstPlay = false
	}
})

		const sff = new ITrack('Soft Freak Fiesta', [
{url: `${this.pathMusic}/SFF_IntroMenuMusic.ogg`, key: 'sffIntroMenuMusic', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_MenuMusic.ogg`, key: 'sffMenuMusic', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LevelMusic_noEnv.ogg`, key: 'sffLevelMusicNoEnv', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LevelMusic_bubbling.ogg`, key: 'sffLevelMusicBubbling', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LoseJingle.ogg`, key: 'sffLoseJingle', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_WinJingle.ogg`, key: 'sffWinJingle', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1}
],
(track: ITrack) => {
	return async () => {
		const introMenu = this.soundManager.instance.getSound(track.soundDatas[0].key)
		const mainMenu = this.soundManager.instance.getSound(track.soundDatas[1].key)
		const levelNoEnv = this.soundManager.instance.getSound(track.soundDatas[2].key)
		const levelBubbling = this.soundManager.instance.getSound(track.soundDatas[3].key)
		const loseJingle = this.soundManager.instance.getSound(track.soundDatas[4].key)
		const winJingle = this.soundManager.instance.getSound(track.soundDatas[5].key)
		let playLose = true

		let playReturn: PlayReturn
		playReturn = await introMenu.play()
		this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))

		this._awaitingFirstPlay = false

		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener())

		let nrOfLoop = 4
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
			this.instanceEndedListeners.forEach((listener) => listener())

			--nrOfLoop
		} while (nrOfLoop > 0)
	}
})

		this._byTracksArr = [
			{by: 'Music', tracks: [
				// hhiaugl
			]},
			{by: 'Game Music - Layered', tracks: [
				godsruleLayered,
				// votLayered
			]},
			{by: 'Game Music', tracks: [
				// cpp,
				// ssix,
				sff,
				// habitarium,
				// tp,
				// jol2008,
				// jol2009,
				wyf,
				// kyf,
				// stackem,
				// glow,
				// godsrule,
				// vot,
				// crisis
			]}
		]
	}

}
