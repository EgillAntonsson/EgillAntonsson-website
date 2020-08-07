import { Injectable } from '@angular/core'
import { SoundManagerService } from './soundManager.service'
import { ITrack as ITrack, LayeredMusicTrack, EmptyTrack, Track } from 'app/shared/data/track'
import { SoundType } from 'soundcommon/enum/soundType'
import { LayeredMusicController } from 'soundcommon/layeredMusicController'
import { SoundInstance } from 'soundcommon/interface/soundInstance'
import { BooleanEmitter } from '../../soundcommon/emitter/booleanEmitter'
import { LogType } from 'app/shared/Log';
import { SoundData } from '../../soundcommon/interface/soundData'

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

	private emptyTrack: EmptyTrack
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
	readonly instanceEndedListeners: Map<string, (trackEnded?: boolean, timeout?: NodeJS.Timeout) => void>

	constructor(private soundManager: SoundManagerService) {
		this.emptyTrack = new EmptyTrack('select a track')
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

		this._awaitingFirstPlay = true
		track.play()()

		if (track instanceof LayeredMusicTrack) {
			track.layeredMusicController.gainsDisabled = gainsDisabled
		}

		this._selectedTrack = track
	}

	stop() {
		this.soundManager.instance.stopMusic()

		if (this._selectedTrack instanceof LayeredMusicTrack) {
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
		const godsruleLayered = new LayeredMusicTrack('Godsrule: Village', [
{url: `${this.pathMusic}/loton_MusicVillageEnvironmentLayer.ogg`, key: 'godsruleEnvironmentLayer', soundType: SoundType.Music, maxGain: 0.075, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/loton_MusicVillageStringLayer.ogg`, key: 'godsruleStringLayer', soundType: SoundType.Music, maxGain: 0.55, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/loton_MusicVillageHarpLayer.ogg`, key: 'godsruleHarpLayer', soundType: SoundType.Music, maxGain: 0.4, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/loton_MusicVillagePianoLayer.ogg`, key: 'godsrulePianoLayer', soundType: SoundType.Music, maxGain: 0.35, loop: true, maxNrPlayingAtOnce: 1}
],
() => {
	if (!godsruleLayered.layeredMusicController) {
		const sounds = [
			this.soundManager.instance.getSound(godsruleLayered.soundDatas[0].key),
			this.soundManager.instance.getSound(godsruleLayered.soundDatas[1].key),
			this.soundManager.instance.getSound(godsruleLayered.soundDatas[2].key),
			this.soundManager.instance.getSound(godsruleLayered.soundDatas[3].key)
		]
		godsruleLayered.layeredMusicController = new LayeredMusicController(sounds, 3, this.log)
	}

	return async () => {
		const instances: SoundInstance[] = []
		for (let i = 0; i < godsruleLayered.layeredMusicController.layerSounds.length; i++) {
			const sound = godsruleLayered.layeredMusicController.layerSounds[i]
			const {instance} = await sound.play()
			instances.push(instance)
			this.instancePlayedListeners.forEach((listener) => listener(instance))
		}
		godsruleLayered.layeredMusicController.start(instances)
		this._awaitingFirstPlay = false
	}
})

const votLayered = new LayeredMusicTrack('Vikings of Thule: Map', [
{url: `${this.pathMusic}/VOT_InterfaceMusic_0.mp3`, key: 'votWindLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_InterfaceMusic_3.ogg`, key: 'votChoirLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_InterfaceMusic_2.ogg`, key: 'votHarpLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_InterfaceMusic_1.ogg`, key: 'votMelodyLayer', soundType: SoundType.Music, maxGain: 1, loop: true, maxNrPlayingAtOnce: 1}
],
() => {
	if (!votLayered.layeredMusicController) {
		const sounds = [
			this.soundManager.instance.getSound(votLayered.soundDatas[0].key),
			this.soundManager.instance.getSound(votLayered.soundDatas[1].key),
			this.soundManager.instance.getSound(votLayered.soundDatas[2].key),
			this.soundManager.instance.getSound(votLayered.soundDatas[3].key)
		]
		votLayered.layeredMusicController = new LayeredMusicController(sounds, 3, this.log)
	}

	return async () => {
		const instances: SoundInstance[] = []
		for (let i = 0; i < votLayered.layeredMusicController.layerSounds.length; i++) {
			const sound = votLayered.layeredMusicController.layerSounds[i]
			const {instance} = await sound.play()
			instances.push(instance)
			this.instancePlayedListeners.forEach((listener) => listener(instance))
		}
		votLayered.layeredMusicController.start(instances)
		this._awaitingFirstPlay = false
	}
})

		const cpp = new Track('Cake Pop Party', [
{url: `${this.pathMusic}/CPP_workMusicIntroScreen.ogg`, key: 'cppMusicIntro', soundType: SoundType.Music, maxGain: 0.7, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/CPP_musicTransitionBeatFade.ogg`, key: 'cppMusicScaleBeat', soundType: SoundType.Music, maxGain: 0.6, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/CPP_workMusicMakePopLoop.ogg`, key: 'cppMusicMakePop', soundType: SoundType.Music, maxGain: 0.7, loop: false, maxNrPlayingAtOnce: 1}
],
() => {
	return async () => {
		const intro = this.soundManager.instance.getSound(cpp.soundDatas[0].key)
		const scaleBeat = this.soundManager.instance.getSound(cpp.soundDatas[1].key)
		const makePop = this.soundManager.instance.getSound(cpp.soundDatas[2].key)

		let playReturn: PlayReturn
		let nrOfLoop = 2
		do {
			playReturn = await intro.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			this._awaitingFirstPlay = false
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await intro.play()
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
{url: `${this.pathMusic}/SSIX_menu.ogg`, key: 'ssixMenu', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SSIX_game.ogg`, key: 'ssixGame', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SSIX_HexagoTune.ogg`, key: 'ssixHexago', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
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
{url: `${this.pathMusic}/Habitarium_main_theme.ogg`, key: 'habitariumMainTheme', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/Habitarium_InGameLoop.ogg`, key: 'habitariumInGameLoop', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1}
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
{url: `${this.pathMusic}/TP_mainThemeIntro.ogg`, key: 'tpMainThemeIntro', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_mainThemeBridge.ogg`, key: 'tpMainThemeBridge', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_spaceWorld.ogg`, key: 'tpSpaceWorld', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_tomb.ogg`, key: 'tpTomb', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_lazyStyle.ogg`, key: 'tpLazyStyle', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_cutScene.ogg`, key: 'tpCutScene', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_inGame.ogg`, key: 'tpInGame', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/TP_outoftime.ogg`, key: 'tpOutOfTime', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1}
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
	{url: `${this.pathMusic}/WYF_ThemeSong.ogg`, key: 'wyf', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
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
{url: `${this.pathMusic}/KYF_IntroMusic_WithAudience.ogg`, key: 'kyfIntroMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/KYF_90secondsMusic.ogg`, key: 'kyf90secMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
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
{url: `${this.pathMusic}/Stackem_Tune_loop.ogg`, key: 'stackem', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1}
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
{url: `${this.pathMusic}/Krepp_Byrjun.ogg`, key: 'crisisBegin', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/Krepp_Endir.ogg`, key: 'crisisEnd', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1}
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
{url: `${this.pathMusic}/GLOB_main_music.mp3`, key: 'glowMainMusic', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/GLOB_village_music.mp3`, key: 'glowVillageMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/GLOB_wack_a_mole.mp3`, key: 'glowWack', soundType: SoundType.Music, maxGain: 0.8, loop: false, maxNrPlayingAtOnce: 1}
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
{url: `${this.pathMusic}/LOTON_BattleBaseLayer.ogg`, key: 'godsruleBattle', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/LOTON_CombatDefeatMusic.ogg`, key: 'godsruleDefeat', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/LOTON_CombatVictory.ogg`, key: 'godsruleVictory', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
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
		const duration = playReturn.instance.sourceNode.buffer.duration
		playReturn.instance.gainWrapper.setTargetAtTime(0, curTime + (duration / 2), (duration / 6))

		await playReturn.endedPromise
		this.instanceEndedListeners.forEach((listener) => listener(true))
	}
})

const vot = new Track('Vikings of Thule: Feud', [
{url: `${this.pathMusic}/VOT_FeudMusic_drums.ogg`, key: 'votFeudDrums', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_FeudMusic.ogg`, key: 'votFeud', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/VOT_FeudEnding.ogg`, key: 'votFeudEnding', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
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
		const duration = playReturn.instance.sourceNode.buffer.duration
		playReturn.instance.gainWrapper.setTargetAtTime(0, curTime + duration - 0.799, 1)

		let timeout: NodeJS.Timeout
		const asyncTimeout = async () => {
			this.instanceEndedListeners.forEach((listener) => listener())

			playReturn = await feudEnding.play()
			this.instancePlayedListeners.forEach((listener) => listener(playReturn.instance))
			await playReturn.endedPromise
			this.instanceEndedListeners.forEach((listener) => listener(true, timeout))
		}

		timeout = setTimeout(() => {
			asyncTimeout()
		}, (playReturn.instance.sourceNode.buffer.duration * 1000) - 799)
	}
})

		const jol2008 = new Track('Christmas Game 2008', [
{url: `${this.pathMusic}/jolagogo2008_main_music.ogg`, key: 'jol2008mainMusic', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/jolagogo2008_game_over.ogg`, key: 'jol2008gameOver', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
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
{url: `${this.pathMusic}/jolagogo2009_Bridge.ogg`, key: 'jol2009bridge', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/jolagogo2009_Chorus.ogg`, key: 'jol2009chorus', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1}
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
{url: `${this.pathMusic}/SFF_IntroMenuMusic.ogg`, key: 'sffIntroMenuMusic', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_MenuMusic.ogg`, key: 'sffMenuMusic', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LevelMusic_noEnv.ogg`, key: 'sffLevelMusicNoEnv', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LevelMusic_bubbling.ogg`, key: 'sffLevelMusicBubbling', soundType: SoundType.Music, maxGain: 1, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_LoseJingle.ogg`, key: 'sffLoseJingle', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1},
{url: `${this.pathMusic}/SFF_WinJingle.ogg`, key: 'sffWinJingle', soundType: SoundType.Music, maxGain: 0.9, loop: false, maxNrPlayingAtOnce: 1}
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
			{by: 'Music', tracks: [
				// hhiaugl
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
